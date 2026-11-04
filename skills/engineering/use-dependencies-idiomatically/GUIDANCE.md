# Project guidance for a dependency

Reached from [SKILL.md](SKILL.md) step 3, to find guidance, and from its Reply, to propose some. Guidance is a **cache** of what step 3 learned, so the next session starts from it instead of relearning the model.

## Finding it

Search where this project keeps guidance, for the package name or a topic that covers it:

- the files agents load first: `AGENTS.md` and `CLAUDE.md` at every level, and rules folders such as `.cursor/rules` and `.claude/rules`;
- the indexes those files point at, such as a guidance or docs folder;
- architecture decision records (ADRs), and `CONTRIBUTING.md`.

**Done when** you have read every guidance entry that names the dependency, or confirmed there is none.

## What belongs in it

Record what an agent cannot find by looking:

- each guarantee and ownership rule, generated code included (for example: each request owns its own database session; generated client code changes only by regenerating it from its schema);
- the canonical structure in this codebase: which modules import what, and where the library is configured;
- deliberate house decisions that depart from the library's defaults, each with its reason;
- the doc pages that settled each point;
- which of the library's checks the project runs;
- the version the entry was written against.

Leave the API itself to the docs, which step 3 reads anyway. A rule a tool can check belongs in a lint rule or compiler option, with the guidance pointing at it.

## Proposing it

When a run learns something durable (a guarantee, an ownership rule, a gotcha that changed a decision, or an audit's notes), draft the entry in the Reply and say where it would go. Write it when the user agrees, or straight away when the project's instructions say agents maintain guidance.

Put it in the project's existing home for guidance:

1. **An entry that already covers the dependency or its topic**: extend it, and update its version.
2. **The project's guidance mechanism**: a new entry with the same naming, frontmatter and index step as its neighbours (for example, regenerating an index).
3. **No mechanism, but directory-level `AGENTS.md` or `CLAUDE.md` files**: add one in the directory that uses the dependency, set up like the others (some projects symlink `CLAUDE.md` to `AGENTS.md`).
4. **None of these**: ask the user where guidance should live.

Every entry needs a **pointer**, a line in a file agents already load that names the entry and when to read it, because guidance nothing points at never gets read.

**Done when** the entry is in place, the pointer reaches it, and the entry records its version.

## Keeping it current

When the code or the docs contradict an entry, the entry is stale. Propose the correction in the same change, the same way. On a major upgrade, recheck every entry for that dependency.
