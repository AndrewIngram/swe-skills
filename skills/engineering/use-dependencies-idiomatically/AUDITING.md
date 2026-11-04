# Auditing a codebase's use of a dependency

Reached from [SKILL.md](SKILL.md) when the task is the whole codebase's use of a library, not a single change.

1. **Learn the model before searching the code.** Do SKILL.md step 3 from the docs, and write notes: each guarantee the library maintains, each ownership rule (generated code included), and the canonical structure of a module that uses it.

   **Done when** every note cites the doc page it came from.

2. **List every surface the project touches**: the runtime API, generated code, compiler or codegen config, test utilities, lint plugins, and type packages checked against the runtime version.

   **Done when** each surface is assigned to a part of the audit.

3. **Build the checklist from the notes.** For each rule, count where the code conforms as well as where it does not. Both counts together (say 397 conforming against 43 not) show whether you are looking at a convention problem or a few one-offs.

   **Done when** every rule has both counts.

4. **When delegating, split the work by guarantee or by surface**, so that each surface has one owner and nothing sits between the areas of the runtime API. Brief each agent with the notes and doc links, so it can find violations you have not thought of yet.

5. **Rank the findings** by SKILL.md's severity rule: a defeated guarantee first, then the other fighting smells, then underuse.

6. **Propose enforcement** for each rule a tool can check: the library's own lint rule or compiler option first, then a project lint rule. Enforced rules are how the next change gets it right first time.

7. **Propose the notes as guidance**, per [GUIDANCE.md](GUIDANCE.md), for the rules a tool cannot check, so the next session starts from them.

**Reply:** the notes with their sources, both counts for each rule, the findings in severity order, and the enforcement and guidance you propose.
