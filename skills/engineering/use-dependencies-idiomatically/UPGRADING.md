# Adding or upgrading a dependency

Reached from [SKILL.md](SKILL.md) when the right tool is not installed yet, when the installed version lacks what you need, or when an upgrade is the task.

## Adding a package

Ask the user before adding a package new to the project. Propose it with:

- the general problem it solves (SKILL.md step 1), and how its model fits (step 3);
- why the dependencies already installed do not fit;
- maintenance signals: release activity, types, license, and bundle size for frontend code.

Declare it the way the project declares its other dependencies: a workspace catalog, a shared constraints file, pinned or ranged versions.

**Done when** the user has agreed to the package, or chosen another route.

## Upgrading

The changelog records what the maintainers meant to change, in their terms. **Hyrum's law** says every observable behaviour has a dependant somewhere: output size, persisted format, defaults, timing, memory use. Semver protects the public API, and your usage may depend on more.

A build-only or test-only tool needs only the changelog and a green build. Every other dependency takes the steps below, with step 2 deciding where the checking effort goes.

1. **Map our usage and its constraints.**
   - Which features, extensions and options the codebase uses, found from its imports and configuration.
   - What the library's output reaches beyond the process: persisted data (documents, serialized state, caches), wire formats, generated files, other services.
   - The limits that usage runs under: memory and CPU where it runs, storage and payload size, timeouts, bundle size, rate limits, cost. Look in infrastructure config, the platform's documented limits, past incidents, and the project's guidance ([GUIDANCE.md](GUIDANCE.md)).

   **Done when** you can say what we persist or send through the dependency, and which limit each would hit first.

2. **Triage the risk.** Read the changelog and migration guide between the installed and target versions, and note the transitive dependencies that move with it. Then weigh each area from step 1:
   - **Impact if it changed:** a limit already near its ceiling, persisted data that cannot be rolled back, a hot path, many users.
   - **Likelihood it changed:** a major version, a rewrite of the subsystem behind it, changelog entries near it, defaults or serialization touched.

   Check an area when both are real. Skip it when either is negligible, and say so: a patch release in an area we barely use needs no more than the changelog.

   **Done when** each area is marked check or skip, with its reason.

3. **Check each area at risk**, most direct evidence first, and stop once the effect is clear:
   1. **Measure.** Run the installed and target versions on realistic data, preferably from the large end of what production holds, and compare the numbers the limits apply to: persisted size, peak memory, payload size, bundle size, query count. A changelog line such as "timestamps are now included by default" reads as minor, and it grows every stored record and every response; a measurement on large inputs catches that without reading any code.
   2. **The release's issues and pull requests** for that area, which often explain a change the changelog summarises in a line.
   3. **The code diff between the two tags**, in a reference checkout or the upstream repository, narrowed to the files behind that area. Read it when a measurement moved and you need the cause, or when the area cannot be measured.

   **Done when** each checked area has a stated effect (unchanged, or what changes and roughly by how much), or the user has accepted the risk unchecked.

4. **Propose it** with:
   - what the upgrade unlocks for this problem, or why it is due;
   - the size of the jump in semver terms: patch, minor or major;
   - the breaking changes that touch this codebase, found by searching for the APIs they name;
   - the areas you checked, with their numbers, and the areas you skipped, with the reason;
   - what else is tied to the version: peer dependencies, sibling packages released together, the runtime;
   - whether it can be rolled back. When the new version rewrites persisted data, rolling back the code leaves the data in the new format, so the upgrade is a data migration and needs a rollout plan: a flag, a canary, or a reader that accepts both formats.

Ask before upgrading. A minor bump with no behaviour change from step 3 is usually cheap and can land with the change. A major or runtime upgrade, or one that changes persisted data, is the user's call, and usually its own change. When the upgrade would unlock what you need, use the escape hatch or a small adapter behind a seam until it lands, with a comment naming the version that will replace it.

After the upgrade, record what step 1 found in the project's guidance for the dependency, and on a major upgrade recheck the rest of that guidance ([GUIDANCE.md](GUIDANCE.md)).

**Done when** the user has decided with the measurements in hand, and any stopgap names the version that replaces it.
