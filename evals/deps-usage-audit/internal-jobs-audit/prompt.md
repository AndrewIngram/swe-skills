---
description: Audit a billing app's use of an in-repo jobs package no model has seen. Four violations of rules stated only in the package's concept docs, which type-check cleanly, beside call sites that follow them.
tags: [audit, internal-library]
runs: 3
max_turns: 60
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite]
---

/deps-usage-audit Can you audit how the billing app uses our jobs package? We're about to move more background work onto it, so first I want to know whether the existing handlers and call sites use it the way it's meant to be used, and what to fix first.
