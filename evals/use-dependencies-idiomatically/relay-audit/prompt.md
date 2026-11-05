---
description: Audit a small Relay app with two cross-module masking violations that type-check cleanly, beside components that use their own fragments correctly.
tags: [audit]
runs: 3
max_turns: 60
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite]
---

Can you audit how this app uses Relay? We're about to onboard a few more engineers onto the frontend, and I want to know whether we're using it the way it's meant to be used, and what to fix first.
