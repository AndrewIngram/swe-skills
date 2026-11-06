#!/usr/bin/env python3
"""Measure how often Claude Code loads a skill for each query in a trigger-queries.json file.

Each run gets a fresh project directory with the skill folder installed as a real project
skill, `.claude/skills/<name>/`, under its own name, so the agent sees the same name and
description a user's install shows. A run counts as a trigger when the agent loads the skill
at any point in its turn, through the Skill tool or by reading its SKILL.md. An installed
user-level copy of the skill is hidden for the duration and put back afterwards.

Usage:
  scripts/claude-trigger-eval.py evals/<skill>/trigger-queries.json \
      --skill skills/<bucket>/<skill> [--runs 3] [--workers 6] [--max-turns 6] [--pointer CLAUDE.md] [--out results.json]
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


def loads_skill(block: dict, name: str) -> bool:
    if block.get("type") != "tool_use":
        return False
    tool_input = block.get("input") or {}
    if block.get("name") == "Skill":
        skill = str(tool_input.get("skill", ""))
        return skill == name or skill.endswith(f":{name}")
    if block.get("name") == "Read":
        return f"/{name}/SKILL.md" in str(tool_input.get("file_path", ""))
    return False


def run_once(query: str, skill: Path, name: str, args) -> bool:
    root = Path(tempfile.mkdtemp(prefix="claude-trigger-"))
    try:
        shutil.copytree(skill, root / ".claude" / "skills" / name)
        if args.pointer:
            # A project instruction file that points at the skill, as a project might add.
            shutil.copyfile(args.pointer, root / "CLAUDE.md")
        command = [
            "claude",
            "-p",
            query,
            "--output-format",
            "stream-json",
            "--verbose",
            "--max-turns",
            str(args.max_turns),
        ]
        if args.model:
            command += ["--model", args.model]
        # Unset so the run can start from inside a Claude Code session.
        env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}
        proc = subprocess.Popen(
            command,
            cwd=root,
            env=env,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        )
        timer = threading.Timer(args.timeout, proc.kill)
        timer.start()
        try:
            for line in proc.stdout:
                try:
                    event = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if event.get("type") == "assistant":
                    content = event.get("message", {}).get("content", [])
                    if any(loads_skill(block, name) for block in content):
                        return True
                if event.get("type") == "result":
                    return False
            return False
        finally:
            timer.cancel()
            proc.kill()
            proc.wait()
    finally:
        shutil.rmtree(root, ignore_errors=True)


class HiddenUserCopy:
    """Moves a user-level symlink to the skill aside while the runs use the candidate."""

    def __init__(self, name: str):
        self.link = Path.home() / ".claude" / "skills" / name
        self.target = None

    def __enter__(self):
        if self.link.is_symlink():
            self.target = os.readlink(self.link)
            self.link.unlink()
        elif self.link.exists():
            sys.exit(
                f"{self.link} is installed and is not a symlink; move it aside first"
            )
        return self

    def __exit__(self, *exc):
        if self.target and not self.link.exists():
            self.link.symlink_to(self.target)


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("queries", type=Path)
    parser.add_argument(
        "--skill", type=Path, required=True, help="skill folder holding SKILL.md"
    )
    parser.add_argument("--runs", type=int, default=3)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--max-turns", type=int, default=6)
    parser.add_argument("--timeout", type=int, default=180, help="seconds per run")
    parser.add_argument("--model")
    parser.add_argument("--pointer", type=Path, help="file to install as the project's CLAUDE.md")
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()

    skill = args.skill.resolve()
    frontmatter = (skill / "SKILL.md").read_text().split("---")[1]
    name = next(
        line.split(":", 1)[1].strip()
        for line in frontmatter.splitlines()
        if line.startswith("name:")
    )
    queries = json.loads(args.queries.read_text())
    jobs = [(i, q) for i, q in enumerate(queries) for _ in range(args.runs)]

    outcomes: dict[int, list[bool]] = {i: [] for i in range(len(queries))}
    with HiddenUserCopy(name), ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(run_once, q["query"], skill, name, args): i for i, q in jobs
        }
        for done, future in enumerate(as_completed(futures), 1):
            outcomes[futures[future]].append(future.result())
            print(f"\r{done}/{len(jobs)} runs", end="", file=sys.stderr, flush=True)
    print(file=sys.stderr)

    results = [
        {
            "query": q["query"],
            "should_trigger": q["should_trigger"],
            "triggers": sum(outcomes[i]),
            "runs": len(outcomes[i]),
        }
        for i, q in enumerate(queries)
    ]
    should = [r for r in results if r["should_trigger"]]
    should_not = [r for r in results if not r["should_trigger"]]
    print(
        f"{name}: should-trigger {sum(r['triggers'] for r in should)}/{sum(r['runs'] for r in should)}"
        f"  false triggers {sum(r['triggers'] for r in should_not)}/{sum(r['runs'] for r in should_not)}"
    )
    for r in results:
        wrong = (
            r["triggers"] < r["runs"] / 2 if r["should_trigger"] else r["triggers"] > 0
        )
        if wrong:
            print(
                f"  {r['triggers']}/{r['runs']} {'T' if r['should_trigger'] else 'F'} {r['query'][:90]}"
            )

    if args.out:
        args.out.write_text(
            json.dumps(
                {"skill": name, "runs_per_query": args.runs, "results": results},
                indent=2,
            )
        )


if __name__ == "__main__":
    main()
