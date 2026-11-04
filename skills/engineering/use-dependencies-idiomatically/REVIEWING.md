# Reviewing a change for dependency use

Reached from [SKILL.md](SKILL.md) when reviewing someone else's diff. For a codebase-wide review, use [AUDITING.md](AUDITING.md) instead.

Before reading the diff, do SKILL.md step 3 from the docs for each dependency it touches, so the guarantees and ownership rules are in hand.

For each hunk that touches a dependency or its generated code, and each new general-purpose helper:

1. Name the general problem it solves (SKILL.md step 1).
2. Check whether the project's dependencies, its shared packages or the standard library already solve it at the installed versions (step 2).
3. Check it against SKILL.md's two lists of smells, searching deliberately for a defeated guarantee, which type-checks cleanly.
4. For each finding, give the idiomatic alternative and where the library documents it, ranked by SKILL.md's severity rule.

Also flag new packages that overlap ones already installed, and workarounds for behaviour the library lets you configure through an option or extension point.

Small plain code that does its job clearly passes: idiomatic code reaches for a library when the library earns it.

**Done when** every dependency-touching hunk and every new general-purpose helper in the diff has a verdict.
