# Adding or upgrading a dependency

Reached from [SKILL.md](SKILL.md) when the right tool is not installed yet, or the installed version lacks what you need.

## Adding a package

Ask the user before adding a package new to the project. Propose it with:

- the general problem it solves (SKILL.md step 1), and how its model fits (step 3);
- why the dependencies already installed do not fit;
- maintenance signals: release activity, types, license, and bundle size for frontend code.

Declare it the way the project declares its other dependencies: a workspace catalog, a shared constraints file, pinned or ranged versions.

**Done when** the user has agreed to the package, or chosen another route.

## Upgrading

When a newer version of an installed dependency, or of the runtime, has what you need, propose the upgrade instead of a stopgap the upgrade would delete. Read the changelog between the installed and target versions, then tell the user:

- what the upgrade unlocks for this problem;
- the size of the jump in **semver** terms: patch, minor or major;
- which breaking changes touch this codebase, found by searching for the APIs they name;
- what else is tied to the version: peer dependencies, sibling packages released together, the runtime.

Ask before upgrading. A minor bump is usually cheap and can land with the change. A major or runtime upgrade is the user's call, and usually its own change. Until it lands, use the escape hatch or a small adapter behind a seam, with a comment naming the version that will replace it.

After a major upgrade, recheck the project's guidance for that dependency ([GUIDANCE.md](GUIDANCE.md)).

**Done when** the user has decided, and any stopgap names the version that replaces it.
