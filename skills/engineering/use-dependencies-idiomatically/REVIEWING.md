# Reviewing a change for dependency use

Reached from [SKILL.md](SKILL.md) when reviewing someone else's diff. For a codebase-wide review, use [AUDITING.md](AUDITING.md), which ranks its findings with the rule below.

Before reading the diff, do SKILL.md step 3 from the docs for each dependency it touches, so the guarantees and ownership rules are in hand.

For each hunk that touches a dependency or its generated code, and each new general-purpose helper:

1. Name the general problem it solves (SKILL.md step 1).
2. Check whether the project's dependencies, its shared packages or the standard library already solve it at the installed versions (step 2).
3. Check it against SKILL.md's two lists of smells, searching deliberately for a defeated guarantee, which type-checks cleanly.
4. For each finding, give the idiomatic alternative and where the library documents it, ranked by the rule below.

Also flag a change that creates the conditions for a latent finding elsewhere, such as adding concurrency or raising a batch size, since it makes that finding live. Flag new packages that overlap ones already installed, and workarounds for behaviour the library lets you configure through an option or extension point.

Small plain code that does its job clearly passes: idiomatic code reaches for a library when the library earns it.

**Done when** every dependency-touching hunk and every new general-purpose helper in the diff has a verdict.

## Ranking findings

Rank by what the library is there to provide, and by whether our usage reaches it.

1. **Name the conditions.** Each failure needs certain conditions to cause harm: concurrency, data volumes, how long work runs, how deploys roll out. Take them from the docs.
2. **Check our usage for them**, from the cheapest evidence that settles the tier: configuration, infrastructure, call sites, data volumes, deploy practice. A trace through the code and the docs is usually enough. Run an experiment, such as a reproduction, when the tier or the fix turns on behaviour the trace cannot settle. Ask the user for what the repository cannot show, such as production traffic or how long runs last.
3. **Assign a tier.** A finding whose conditions occur today is **live**, even if nothing has failed yet. One that needs a change in our usage is **latent**: name the change that would expose it. One database session shared across threads breaks only when two threads use it at once, so in a single-threaded worker it is latent until someone adds concurrency.
4. **Order them**: live findings first, then latent ones. Within each tier, a defeated guarantee comes first, then the other fighting smells, then underuse. A house rule that encodes the library's model takes the model's severity.

**Done when** each finding has its conditions, the evidence for or against them, and its tier.
