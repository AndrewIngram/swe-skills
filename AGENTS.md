# swe-skills

Agent skills for software engineering, published as a Claude Code plugin and through skills.sh. This file is for agents and people maintaining the repo; [README.md](README.md) is for people installing the skills.

## Layout

- `skills/<bucket>/<skill>/SKILL.md`: one folder per skill, grouped into buckets (`engineering/` for now). Reference that only some runs need sits beside `SKILL.md` and is reached by a link from it.
- `skills/<bucket>/<skill>/evals/`: the skill's evals. `trigger-queries.json` holds should-trigger and should-not-trigger queries for the description.
- `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`: the Claude Code plugin and the marketplace that serves it.
- `scripts/link-skills.sh`: symlinks every skill into `~/.claude/skills` and `~/.agents/skills`, for working on the skills locally.

## Adding a skill

1. Create `skills/<bucket>/<name>/SKILL.md` with `name` and `description` frontmatter.
2. Add its folder to the `skills` array in `.claude-plugin/plugin.json`.
3. Add it to the skills list in `README.md`.
4. Add `evals/trigger-queries.json` with realistic should-trigger queries and near misses.
5. Run `claude plugin validate .` and `scripts/link-skills.sh`.

## Writing skills

- Use established engineering terms (_XY problem_, _impedance mismatch_, _smell_, _seam_) instead of coining new words for the same ideas.
- State the behaviour you want; a prohibition makes the forbidden behaviour more available, not less.
- End each step on a **Done when** criterion the agent can check.
- Keep in `SKILL.md` what every path needs, and move what only some paths reach into a sibling file behind a link.
- Treat the description as always-loaded context: one trigger per branch, leading word first.

## Changing a description

Measure before and after. Run the trigger queries several times per query (descriptions trigger stochastically, so three runs per query is the minimum and six is better), and keep a change only when it holds the should-trigger rate without new false triggers. Exclusion clauses ("Not X") have backfired here: test them like any other wording.

## Releasing

Bump `version` in `.claude-plugin/plugin.json`. Plugin installs only pick up a release when that field changes.
