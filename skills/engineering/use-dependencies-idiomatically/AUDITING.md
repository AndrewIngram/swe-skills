# Auditing a codebase's use of a dependency

Reached from [SKILL.md](SKILL.md) when the task is a codebase's use of one or more libraries, not a single change. A quick review and a full audit take the same steps; the scope sets how far each one goes.

1. **Set the scope.** From the request, write down which dependencies, which parts of the codebase, and how deep: a review of idiomatic use, or a full audit. Name what you are leaving out. Ask the user when the request leaves this open.

   **Done when** the scope and its exclusions are written down.

2. **Learn the model from the concept docs, before reading the code.** For each dependency, read its overview and concept pages far enough to answer SKILL.md step 3's model questions for the library as a whole: what it owns, what it generates, what it guarantees, and its canonical structure. That is usually the overview and a handful of concept pages per library. Learn the model whole, because feature pages read one at a time give an accurate API and a wrong model, and only the whole model shows what the code should be using and is not. Note each guarantee and ownership rule with the doc page it came from.

   **Done when** you can state each guarantee and ownership rule, with its source.

3. **Inventory the code in scope** against the model: which features and surfaces it uses (runtime API, generated code, codegen or compiler config, test utilities, lint plugins), and where. Note the affordances the model says fit this code that the inventory does not show.

   **Done when** each surface in scope is listed with where it is used.

4. **Check the code against the notes**, reading the guide or reference page for each feature as you reach it. Search deliberately for defeated guarantees, which type-check cleanly. Count a rule's conforming and violating sites when one search gives the count and the number changes the fix, such as whether a convention-wide change or a lint rule is worth it; a rough size ("three files", "most components") is enough.

   **Done when** every rule in the notes has been checked across the scope.

5. **When delegating, split the work by guarantee or by surface**, so that each surface has one owner and nothing sits between the areas of the runtime API. Brief each agent with the scope, the notes and the doc links, so it can find violations you have not thought of yet.

6. **Rank the findings** by exposure, following [REVIEWING.md](REVIEWING.md#ranking-findings). Group a rule's violations by the conditions they share, so each group is one finding.

   **Done when** each finding has its conditions, the evidence for or against them, and its tier.

7. **Propose follow-ups where they pay**, a line or two each: enforcement for a finding that recurs and a tool can check (the library's own lint rule or compiler option first, then a project lint rule), and guidance, per [GUIDANCE.md](GUIDANCE.md), for a lesson the next session would otherwise relearn.

**Reply:** the scope and its exclusions; the findings in severity order, each with its tier, evidence and size; and the follow-ups you propose.
