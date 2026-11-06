---
name: deps-usage-audit
description: "Audit how a codebase uses one or more dependencies against each library's model, with findings ranked by whether our usage reaches them."
disable-model-invocation: true
---

# Auditing a codebase's use of a dependency

Run by name, `/deps-usage-audit` in Claude Code or `$deps-usage-audit` in Codex, or reached from [deps-mental-model](../deps-mental-model/SKILL.md) when the task is a codebase's use of one or more libraries, not a single change. Read [deps-mental-model](../deps-mental-model/SKILL.md) first, as reference: its [Learning the model](../deps-mental-model/SKILL.md#learning-the-model), smells and [Ranking findings](../deps-mental-model/SKILL.md#ranking-findings) sections and its `skip:` rule apply here.

1. **Set the scope**: which dependencies, which parts of the codebase, and the depth.
   - A **review** finds the main problems: steps 2, 4, 5 and the reply. Choose it when the user asks what is wrong, or for a short list.
   - A full **audit** takes every step, so it also inventories each surface, sizes each finding and proposes follow-ups. Choose it when the user asks for an audit or a complete picture.

   Name what you are leaving out. Ask the user when the request leaves the scope or depth open.

   **Done when** the scope, the depth and the exclusions are written down.

2. **Learn the model from the concept docs, before reading the code**, per [Learning the model](../deps-mental-model/SKILL.md#learning-the-model), far enough to answer its questions for each library as a whole. That is usually the overview and a handful of concept pages per library. Learn the whole model, because only the whole model shows what the code should be using and is not. Note each guarantee and ownership rule with the doc page it came from.

   **Done when** you can state each guarantee and ownership rule, with its source.

3. **Inventory the code in scope** (audit): which features and surfaces it uses (runtime API, generated code, codegen or compiler config, test utilities, lint plugins), and where. Note the affordances the model says fit this code that the inventory does not show.

   **Done when** each surface in scope is listed with where it is used.

4. **Check the code against the notes**, reading the guide or reference page for each feature as you reach it. Search deliberately for defeated guarantees. In an audit, count a rule's conforming and violating sites when one search gives the count and the number changes the fix, such as whether a convention-wide change or a lint rule is worth it; a rough size ("three files", "most components") is enough.

   When delegating, split the work by guarantee or by surface, so that each surface has one owner and nothing sits between the areas of the runtime API. Brief each agent with the scope, the notes and the doc links, so it can find violations you have not thought of yet.

   **Done when** every rule in the notes has been checked across the scope.

5. **Rank the findings** by exposure, per [Ranking findings](../deps-mental-model/SKILL.md#ranking-findings). Group a rule's violations by the conditions they share, so each group is one finding.

   **Done when** each finding has its conditions, the evidence for or against them, and its tier.

6. **Propose follow-ups where they pay** (audit), a line or two each: enforcement for a finding that recurs and a tool can check (the library's own lint rule or compiler option first, then a project lint rule), and guidance, per [GUIDANCE.md](../deps-mental-model/GUIDANCE.md), for a lesson the next session would otherwise relearn.

**Reply**, sized to the depth. A review gives only the findings, in severity order, each with its tier, its evidence and the doc page that states the rule it breaks. An audit adds the scope and its exclusions, each finding's size, and the follow-ups.
