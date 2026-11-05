---
type: llm
---

The reply flags that `src/components/ProjectsPage.tsx` copies react-query's `data` into `useState` through a `useEffect`, creating a second source of truth for data the query cache owns. It recommends deriving the visible list from `data` directly (or with the query's `select` option). PASS only if this specific pattern is identified.
