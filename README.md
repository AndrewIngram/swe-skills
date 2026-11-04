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

Every skill here is **model-invoked**: the agent reaches for it when the task fits, and you can also invoke it by name.

### Engineering

- **[use-dependencies-idiomatically](./skills/engineering/use-dependencies-idiomatically/SKILL.md)**: Use the libraries and frameworks a project depends on the way they were designed. Before writing code, the agent restates the problem, finds what already solves it, and learns the library's model from the installed version's docs: what it owns, what it generates, what it guarantees, and which public API covers the case. It then writes the idiomatic solution and checks it against two sets of smells: _fighting the library_ (defeated guarantees, private APIs, behaviour-changing patches, duplicated state, timing workarounds) and _underusing it_ (hand-rolled versions of an affordance the library already has). It also covers reviewing a change, auditing a whole codebase's use of a dependency, adding or upgrading one, and keeping durable per-dependency guidance in the project's own guidance location.

## Why these skills exist

Agents tend to produce a solution at all costs. With dependencies, that shows up three ways: they reinvent what a library already does, they force a library through casts and workarounds until it does what they want, or they take the long way round a feature built for exactly their case. A library was designed for a particular shape of problem, and using it well means learning that shape first. These skills put that step, and the checks that follow it, into the agent's process.

## Evals

Each skill keeps its evals in `evals/` beside its `SKILL.md`. `trigger-queries.json` lists realistic prompts that should and should not load the skill, including near misses that share its vocabulary. It is the input format for the description optimiser in Anthropic's `skill-creator` skill.

## Acknowledgements

The layout follows [mattpocock/skills](https://github.com/mattpocock/skills), and the writing follows its `writing-for-agents` guidance. The structure of the skills also draws on [pstack](https://github.com/cursor/plugins/tree/main/pstack).

## License

[MIT](LICENSE)
