---
description: A bounded review of four libraries in a small app, with one planted non-idiomatic use per library. Checks the findings and that the review stays proportionate to the request.
tags: [review, proportion]
runs: 3
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite]
---

Can you review how this app uses react-query, zod, react-hook-form and date-fns and tell me what isn't idiomatic? I want a short list I can turn into a few tickets.
