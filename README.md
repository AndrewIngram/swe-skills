# SWE Skills

Agent skills for software engineering. Each one targets a failure that coding agents repeat, and steers the agent to the discipline that avoids it.

## Installation

Pick one route per agent. Installing through two routes gives you every skill twice.

<details open>
<summary><strong>Claude Code</strong> (plugin)</summary>

```bash
claude plugin marketplace add AndrewIngram/swe-skills
claude plugin install swe-skills@andrewingram
```

Or, inside Claude Code, run `/plugin marketplace add AndrewIngram/swe-skills` and then `/plugin install swe-skills@andrewingram`.

Claude Code leaves auto-update off for third-party marketplaces. To turn it on, run `/plugin`, open the **Marketplaces** tab, select `andrewingram`, and choose **Enable auto-update**. To update by hand, run `claude plugin update swe-skills@andrewingram`.

</details>

<details>
<summary><strong>Any other agent, or editable copies</strong> (manual updates)</summary>

[skills.sh](https://skills.sh) copies the skills into your project, or into your home directory with `-g`:

```bash
npx skills@latest add AndrewIngram/swe-skills          # choose an agent when asked
npx skills@latest add AndrewIngram/swe-skills -a claude-code -g
```

To update, run `npx skills@latest update`.

</details>

<details>
<summary><strong>From a clone</strong> (for working on the skills)</summary>

```bash
git clone https://github.com/AndrewIngram/swe-skills.git
cd swe-skills
scripts/link-skills.sh
```

This symlinks every skill into `~/.claude/skills` and `~/.agents/skills`, so a `git pull` updates them. It leaves alone any existing skill folder of the same name that is not a symlink.

</details>

## Skills

The skills run when you ask for them: by name (`/deps-usage-audit` in Claude Code, `$deps-usage-audit` in Codex), in your own words ("use the deps mental model skill"), or when your project's instructions tell the agent to. To have the agent use them on its own, see [Automatic use](#automatic-use).

### Engineering

The three `deps-` skills work together, so install them together: the other two read `deps-mental-model` for its steps and rules.

- **[deps-mental-model](./skills/engineering/deps-mental-model/SKILL.md)**: Use the libraries and frameworks a project depends on the way they were designed. Before writing code, the agent restates the problem, finds what already solves it, and learns the library's model from the installed version's docs: what it owns, what it generates, what it guarantees, and which public API covers the case. It then writes the idiomatic solution and checks it against two sets of smells: _fighting the library_ (defeated guarantees, private APIs, behaviour-changing patches, duplicated state, timing workarounds) and _underusing it_ (hand-rolled versions of an affordance the library already has). It also covers reviewing a change that touches a dependency, and keeping durable per-dependency guidance in the project's own guidance location.
- **[deps-upgrade](./skills/engineering/deps-upgrade/SKILL.md)** (by name, or reached from `deps-mental-model` when a package is added or upgraded): Add or upgrade a dependency by mapping how the codebase uses it and the limits that usage runs under, triaging the risk of the change, and checking the areas at risk, measurement first, since the changelog records what the maintainers meant to change and not everything your usage depends on.
- **[deps-usage-audit](./skills/engineering/deps-usage-audit/SKILL.md)** (by name): Audit how a codebase uses one or more dependencies. It sets the scope, learns each library's model before reading the code, checks the code against it, and ranks findings by whether the codebase's usage actually reaches the conditions that make them harmful.

### Automatic use

Agents decide for themselves when to load a skill, and they decide differently: in our measurements Claude Code rarely loaded a skill from its description alone, and Codex loaded one for many tasks it did not fit. So these skills wait to be asked, and you choose when the agent asks. Add a line to the instructions file your agent always reads, `CLAUDE.md` for Claude Code or `AGENTS.md` for Codex and others:

```markdown
- Before writing code that uses or builds on a dependency (a library, framework or the standard library), before writing a general-purpose helper, and when adding or upgrading a package, load the `deps-mental-model` skill and follow it.
```

With that line, Claude Code loaded the skill for every dependency task we tested and Codex for four in five, and both also loaded it for some tasks that merely touch a library, such as writing Jest tests. Narrow it to the work you want covered. For upgrades only:

```markdown
- When adding or upgrading a package, load the `deps-mental-model` skill and follow it.
```

`deps-mental-model` hands upgrades to `deps-upgrade` and audits to `deps-usage-audit`, so the line only needs to name it.

## Why these skills exist

Agents tend to produce a solution at all costs. With dependencies, that shows up three ways: they reinvent what a library already does, they force a library through casts and workarounds until it does what they want, or they take the long way round a feature built for exactly their case. A library was designed for a particular shape of problem, and using it well means learning that shape first. These skills put that step, and the checks that follow it, into the agent's process.

## Evals

Each skill keeps its evals in `evals/<skill>/`:

- `trigger-queries.json`, for a model-invoked skill, lists realistic prompts that should and should not load it, including near misses that share its vocabulary. It is the input format for the description optimiser in Anthropic's `skill-creator` skill, and for `scripts/codex-trigger-eval.py`, which measures the same queries in Codex.
- The other folders are behaviour cases for `claude plugin eval`. Each one is a small fixture project with a prompt and graders, run with and without the skill.

## Acknowledgements

The layout follows [mattpocock/skills](https://github.com/mattpocock/skills), and the writing follows its `writing-for-agents` guidance. The structure of the skills also draws on [pstack](https://github.com/cursor/plugins/tree/main/pstack).

## License

[MIT](LICENSE)
