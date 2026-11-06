#!/usr/bin/env python3
"""Measure how often Codex loads a skill for each query in a trigger-queries.json file.

Each run gets a fresh empty directory holding a copy of the skill in `.agents/skills/`, so
a candidate description can be tested without touching the installed copy, which is
disabled for the run. Codex loads a skill by reading its SKILL.md with a shell command, so
a run counts as a trigger when a `command_execution` event reads that file. The run is
stopped as soon as that happens.

Usage:
  scripts/codex-trigger-eval.py evals/<skill>/trigger-queries.json \
      --skill skills/<bucket>/<skill> [--runs 3] [--workers 4] [--model MODEL] [--pointer AGENTS.md] [--out results.json]
"""

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
import threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


def installed_copies(name: str) -> list[Path]:
    """SKILL.md paths of installed copies of the skill, as the symlink and as its target."""
    paths = []
    for root in [Path.home() / ".agents" / "skills", Path("/etc/codex/skills")]:
        skill_md = root / name / "SKILL.md"
        if skill_md.exists():
            paths += [skill_md, skill_md.resolve()]
    return paths


def run_once(query: str, skill: Path, name: str, args) -> dict:
    root = Path(tempfile.mkdtemp(prefix="codex-trigger-"))
    # Codex scans `.agents/skills` from the working directory up to the repository root, so the
    # candidate sits at the root and the agent works in an empty subdirectory, where exploring
    # the project does not turn up the skill's files.
    workdir = root / "project"
    try:
        workdir.mkdir()
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        shutil.copytree(skill, root / ".agents" / "skills" / name)
        if args.pointer:
            # A project instruction file that points at the skill, as a project might add.
            shutil.copyfile(args.pointer, root / "AGENTS.md")
        marker = f"/{name}/SKILL.md"
        disabled = ", ".join(
            f'{{ path = "{p}", enabled = false }}'
            for other in [name, *args.disable]
            for p in installed_copies(other)
        )
        command = [
            "codex",
            "exec",
            "--json",
            "--ephemeral",
            "--skip-git-repo-check",
            "-s",
            "read-only",
            "-C",
            str(workdir),
            "-c",
            f"skills.config = [{disabled}]",
            "-c",
            "suppress_unstable_features_warning = true",
        ]
        if args.model:
            command += ["-m", args.model]
        command.append(query)

        proc = subprocess.Popen(
            command,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        )
        timer = threading.Timer(args.timeout, proc.kill)
        timer.start()
        triggered, read_path, commands, others = False, None, 0, set()
        try:
            for line in proc.stdout:
                try:
                    event = json.loads(line)
                except json.JSONDecodeError:
                    continue
                item = event.get("item") or {}
                if item.get("type") == "command_execution":
                    commands += 1
                    others.update(re.findall(r"([\w-]+)/SKILL\.md", item.get("command", "")))
                    if marker in item.get("command", ""):
                        triggered, read_path = True, item["command"]
                        proc.kill()
                        break
                if event.get("type") == "turn.completed":
                    break
        finally:
            timer.cancel()
            proc.kill()
            proc.wait()
        # A read of the installed copy means disabling it failed, so the run says nothing about the candidate.
        leaked = bool(read_path) and any(
            str(path.parent) in read_path for path in installed_copies(name)
        )
        others.discard(name)
        return {"triggered": triggered, "leaked": leaked, "commands_before": commands, "other_skills": sorted(others)}
    finally:
        shutil.rmtree(root, ignore_errors=True)


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("queries", type=Path)
    parser.add_argument(
        "--skill", type=Path, required=True, help="skill folder holding SKILL.md"
    )
    parser.add_argument("--runs", type=int, default=3)
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--timeout", type=int, default=240, help="seconds per run")
    parser.add_argument("--model")
    parser.add_argument("--pointer", type=Path, help="file to install as the project's AGENTS.md")
    parser.add_argument(
        "--disable",
        nargs="*",
        default=[],
        metavar="NAME",
        help="other installed skills to disable, such as one a decoy run should not compete with",
    )
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()

    skill = args.skill.resolve()
    name = skill.name
    queries = json.loads(args.queries.read_text())
    jobs = [(i, q) for i, q in enumerate(queries) for _ in range(args.runs)]

    outcomes: dict[int, list[dict]] = {i: [] for i in range(len(queries))}
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(run_once, q["query"], skill, name, args): i for i, q in jobs
        }
        for done, future in enumerate(futures, 1):
            outcomes[futures[future]].append(future.result())
            print(f"\r{done}/{len(jobs)} runs", end="", file=sys.stderr, flush=True)
    print(file=sys.stderr)

    results = []
    for i, q in enumerate(queries):
        runs = outcomes[i]
        results.append(
            {
                "query": q["query"],
                "should_trigger": q["should_trigger"],
                "triggers": sum(r["triggered"] for r in runs),
                "runs": len(runs),
                "leaked": sum(r["leaked"] for r in runs),
                "other_skills": sorted({s for r in runs for s in r["other_skills"]}),
            }
        )

    should = [r for r in results if r["should_trigger"]]
    should_not = [r for r in results if not r["should_trigger"]]
    print(
        f"should-trigger {sum(r['triggers'] for r in should)}/{sum(r['runs'] for r in should)}"
        f"  false triggers {sum(r['triggers'] for r in should_not)}/{sum(r['runs'] for r in should_not)}"
    )
    if any(r["leaked"] for r in results):
        print(
            "warning: some runs read the installed copy instead of the candidate",
            file=sys.stderr,
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
