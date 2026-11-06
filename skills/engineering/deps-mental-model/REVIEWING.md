# Reviewing a change for dependency use

Before reading the diff, learn the model of each dependency it touches, per [Learning the model](SKILL.md#learning-the-model), so the guarantees and ownership rules are in hand.

For each hunk that touches a dependency or its generated code, and each new general-purpose helper:

1. Name the general problem it solves (SKILL.md step 1).
2. Check whether the project's dependencies, its shared packages or the standard library already solve it at the installed versions (step 2).
3. Check it against SKILL.md's two lists of smells, searching deliberately for a defeated guarantee.
4. For each finding, give the idiomatic alternative and where the library documents it, ranked per [Ranking findings](SKILL.md#ranking-findings).

Also flag a change that creates the conditions for a latent finding elsewhere, such as adding concurrency or raising a batch size, since it makes that finding live. Flag new packages that overlap ones already installed, and workarounds for behaviour the library lets you configure through an option or extension point.

**Done when** every dependency-touching hunk and every new general-purpose helper in the diff has a verdict.
