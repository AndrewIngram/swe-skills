---
type: llm
---

The reply flags that `src/lib/time.ts` hand-rolls relative times ("3 days ago") although date-fns is installed and already used in the app, and recommends a date-fns function such as `formatDistanceToNow` or `formatDistance`. PASS only if this specific pattern is identified.
