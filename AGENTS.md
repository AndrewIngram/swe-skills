# swe-skills

Agent skills for software engineering, published as a Claude Code plugin and through skills.sh. This file is for agents and people maintaining the repo; [README.md](README.md) is for people installing the skills.

## Layout

- `skills/<bucket>/<skill>/SKILL.md`: one folder per skill, grouped into buckets (`engineering/` for now). Reference that only some runs need sits beside `SKILL.md` and is reached by a link from it.
- `evals/<skill>/`: the skill's evals, kept outside `skills/` so installs do not ship them and `claude plugin eval` can load them.
  - `trigger-queries.json` holds should-trigger and should-not-trigger queries for the description.
  - Each other folder is a behaviour case for `claude plugin eval`: `prompt.md`, `case.yaml`, `graders/`, and a fixture project in `files/` that `scaffold.sh` copies into the run's workspace.
- `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`: the Claude Code plugin and the marketplace that serves it.
- `scripts/link-skills.sh`: symlinks every skill into `~/.claude/skills` and `~/.agents/skills`, for working on the skills locally.

## Adding a skill

1. Create `skills/<bucket>/<name>/SKILL.md` with `name` and `description` frontmatter.
2. Add its folder to the `skills` array in `.claude-plugin/plugin.json`.
3. Add it to the skills list in `README.md`.
4. Add `evals/<name>/trigger-queries.json` with realistic should-trigger queries and near misses, and behaviour cases for the failures the skill exists to prevent.
5. Run `claude plugin validate .` and `scripts/link-skills.sh`.

## Writing skills

- Use established engineering terms (_XY problem_, _impedance mismatch_, _smell_, _seam_) instead of coining new words for the same ideas.
- State the behaviour you want; a prohibition makes the forbidden behaviour more available, not less.
- End each step on a **Done when** criterion the agent can check.
- Keep in `SKILL.md` what every path needs, and move what only some paths reach into a sibling file behind a link.
- Treat the description as always-loaded context: one trigger per branch, leading word first.

## Changing a description

Measure before and after. Run the trigger queries several times per query (descriptions trigger stochastically, so three runs per query is the minimum and six is better), and keep a change only when it holds the should-trigger rate without new false triggers. Exclusion clauses ("Not X") have backfired here: test them like any other wording.

## Changing a skill's body

Evidence for a change comes from real sessions that used the skill. Run [`retro`](https://github.com/mattpocock/skills/tree/main/skills/engineering/retro) on the session with the skill as the steering file under review, and ask which steps changed a finding or decision, which cost turns without changing anything, and whether the findings held up.

The behaviour cases guard against regressions. Run them before and after, with the no-plugin baseline arm on (the default):

```bash
claude plugin eval . --scaffold --allow-tools Bash WebFetch WebSearch Write Edit
```

Compare the with-skill score against the baseline, and the cost of each arm: a skill that raises the score by inflating the work has a proportion problem.

## Releasing

Bump `version` in `.claude-plugin/plugin.json`. Plugin installs only pick up a release when that field changes.
