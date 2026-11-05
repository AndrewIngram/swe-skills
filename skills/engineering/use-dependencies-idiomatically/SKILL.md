---
name: use-dependencies-idiomatically
description: "Idiomatic use of the libraries and frameworks a project depends on: learning each one's model instead of reinventing the wheel or fighting the framework. Use before writing a general-purpose helper (retries, caching, pagination, concurrency, parsing, validation, date math); when building on or extending a library or framework (ORM, data-fetching client, UI kit, state manager, workflow engine, test runner); when a library, or the installed version of it, seems not to support what you need; when code fights one (casts at its types, private APIs, patches, duplicated state, timing workarounds) or uses it verbosely; when adding or upgrading a package; and when reviewing a change or auditing a codebase's use of a dependency."
---

# Use dependencies idiomatically

Every dependency was built for a particular shape of problem. Its API encodes that **model**: what it owns, what it leaves to you, what it guarantees, and where it expects to be extended. Write the **idiomatic** solution, the one the library's own docs and canonical examples would show, and when the problem has a different shape (an **impedance mismatch**), pick the right tool for the job. The failures to avoid are **reinventing the wheel**, **fighting the framework**, and quietly **underusing** an affordance built for the case.

**Friction is a smell**: a cast, patch or workaround on the obvious path means the model is misread or the tool is wrong. The costliest violations have no friction at all: they type-check and look local while defeating a guarantee the library exists to provide, so look for them on purpose.

Writing code that uses a dependency follows the steps below. The other tasks start from their own file, which reuses those steps:

- Reviewing someone else's change: [REVIEWING.md](REVIEWING.md).
- Auditing a codebase's use of a dependency: [AUDITING.md](AUDITING.md).
- Adding a package, or upgrading a dependency or the runtime: [UPGRADING.md](UPGRADING.md).
- Finding, writing or updating the project's guidance for a dependency: [GUIDANCE.md](GUIDANCE.md).

## Writing code that uses a dependency

1. **Restate the problem.** Watch for the **XY problem**: the task often arrives as a solution, from you or the user. Restate it as the general problem:
   - "Retry the upload three times" is a retry policy.
   - "I need `row_number() over (partition by account_id)` for each account's latest invoices" is top-N per group, which an ORM may model with no window function.

   "The library can't do X" is a claim to verify in step 3, whoever makes it.

   **Done when** you can name the problem in the words the library's docs would use.

2. **Find where it is already solved**, nearest first:
   1. The framework you are inside: a web framework's request validation, an ORM's eager loading, a test runner's fake timers.
   2. The project's declared dependencies (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`) and how the codebase imports them. Existing usage shows the house convention, which can differ from the library's design.
   3. The project's shared packages, which often wrap a dependency the way the project wants it used.
   4. The standard library, for the runtime version in use (`engines`, `.nvmrc`, `requires-python`). Broad ones cover more than people remember: Python's `itertools`, `collections`, `functools`, `pathlib`; modern Node's `fetch`, `AbortSignal.timeout`, `util.parseArgs`, `node:test`.

   **Done when** every source is checked and you have a shortlist, possibly empty.

3. **Learn the model from the installed version's docs.** Take the version from the lockfile; a source counts only if it matches. Read, in order:
   1. **The project's guidance for this dependency**, found and kept per [GUIDANCE.md](GUIDANCE.md). It is the authority on deliberate house decisions and a cache of the library's model: when its recorded version differs from the lockfile, or a claim decides your approach, confirm it in the sources below.
   2. **A reference checkout**: the dependency's repository cloned into the project or fetched by a tool such as `opensrc`, usually with a pointer in `AGENTS.md` or `CLAUDE.md`. Check its tag against the lockfile. Its docs, examples and tests are the best record of intended use.
   3. **The installed package**: exported types and their doc comments, often stripped of docs and examples.
   4. **Online, when neither of the last two has docs**: the official docs for that major version, then the upstream repository at the matching tag.

   In whichever source has docs, read the overview and concept pages before the reference for the feature you need. The guarantees live there, and a reference page read on its own gives the API without the model.

   Build only on the **public API**: what the docs describe, reached through declared entry points (an `exports` map, `__all__`, names without a leading underscore). Read source to understand behaviour; anything you found only there is private. Semver protects the public API and nothing else. Your memory of the library is a hypothesis to check against the docs, and runtime files you happen to open are no substitute for them.

   **Done when** you can answer from the docs, before writing or judging code that uses it:
   - What was it built for, and what does it deliberately leave out?
   - What does it own (store, cache, lifecycle, retries, transactions), what does it generate or ask you to declare (codegen output, schemas, types), and which part of your code is each piece for?
   - What **guarantee** does it maintain (transaction isolation, a UI framework's one-way data flow, a message queue's per-key ordering), between which parts of the system, and what would quietly defeat it? It often sits between your own modules.
   - Which public API and documented extension points (options, plugins, middleware, hooks, escape hatches) cover this, and what does the canonical example look like, down to which module imports what?
   - What checks does it ship (a lint plugin, compiler or codegen validation, a strict type mode), and does the project run them?

4. **Choose the fit:**
   - **The problem matches the model:** use it.
   - **Part of it falls outside the main API:** use the documented **escape hatch** for that part (raw SQL in an ORM, a headless component, a custom serializer). Escape hatches are part of the design.
   - **The installed version lacks it:** if the changelog shows a newer version has it, propose the upgrade per [UPGRADING.md](UPGRADING.md).
   - **Impedance mismatch:** use a dependency whose model fits, or plain code that stays clear of this one, behind a **seam** we own. Fit decides, whatever is already installed or used nearby.

   **Done when** you have picked one and can justify it from the model.

5. **Write it the library's way, on its public API.** The first version that works is often not the idiomatic one. Where neighbouring code and the canonical example disagree, follow the canonical example and tell the user about the drift. Run the library's own checks as you go; if the project leaves them off, say what turning them on would catch.

   **Done when** the library's checks pass, each smell below is either absent or a deliberate choice you will report, and the library's maintainers would recognise the code as their library used as designed.

6. **When friction persists**, first adapt our design to the library's model; its constraints often encode a lesson, as a job queue's at-least-once delivery asks for idempotent handlers. Then revisit step 4. Work against the library only with the user's agreement, naming the undocumented behaviour you rely on in the proposal and in a comment at the workaround. A conflict between the model and a product requirement is the user's call.

## Smells: fighting the library

Each sends you back to step 4. To rank findings, use the severity rule in [REVIEWING.md](REVIEWING.md#ranking-findings).

- **Defeated guarantee**, the most serious: mutating state the framework expects you to replace, one database session or connection shared across requests or threads, a side effect inside a render or a hook the framework may re-run, generated code edited by hand or imported outside the module it was generated for. These type-check cleanly, so search for them deliberately.
- Casts or type-checker suppressions (`as`, `any`, `@ts-expect-error`, `# type: ignore`) where our code meets the library's types.
- **Private API**: internal paths (`pkg/dist/…`, `pkg._internal`), underscore names, undocumented exports, casts into a library object's private fields, behaviour found only in the source. An unstable or experimental API is documented but outside semver: use one when the docs recommend it here, and say so.
- A patch that changes how the library behaves (package-manager patch, monkey-patching, vendored fork). A patch that makes it do what its docs already promise is a bug fix and the right move: keep it to the fix and link the upstream issue.
- Duplicated state: a second **source of truth** for something the library owns, such as a data-fetching cache mirrored into store state, form values copied out of the form library, or retry counts the queue already tracks.
- Timers, flags or effect chains that run code "after" the library, where it offers a callback, event or hook.
- A default overridden at every call site, or a wrapper that undoes a behaviour on every call.
- A **shallow** wrapper that mostly renames the API it wraps. Apply the **deletion test**: if deleting it only moves its calls back to the library, it is not earning its keep.
- Part of a library feature rebuilt because the whole looked like more than you needed.

## Smells: underusing the library

The code works on public API, but an **affordance** built for this case would make it shorter or more declarative. To find it, read the type of each options object you pass and the library's guide for the problem from step 1.

- Several calls making one operation: find-then-create where there is an upsert, writes in a loop where there is a batch API.
- Glue reshaping output, where the query or hook takes a select or projection option.
- State the library tracks, rebuilt by hand: loading, pending, dirty or retry flags.
- The same options at every call site, where there are defaults, shared config, a theme or a factory.
- Imperative code for something the library lets you declare: a schema, a variant, a relation, a policy.

Proportion runs both ways: when a few clear lines of plain code do the job, the plain code is idiomatic.

**Reply:** the library features that carry the behaviour you did not write; for general-purpose code you wrote yourself, what you checked and why nothing fit; each dependency you passed over, and the part of its model that did not match; and each smell you kept, with the reason. When you learned something durable about the dependency, add the guidance you propose, per [GUIDANCE.md](GUIDANCE.md).
