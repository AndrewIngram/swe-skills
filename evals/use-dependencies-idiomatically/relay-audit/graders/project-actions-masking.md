---
type: llm
weight: 2
---

The reply flags `src/components/ProjectActions.tsx` because it reads its data through ProjectCard's fragment (it imports `ProjectCardFragment` and `ProjectCard_project$key` and calls `useFragment` with them) instead of declaring its own fragment. It explains this as breaking Relay's data masking or fragment colocation, and recommends a fragment owned by ProjectActions (for example selecting `id` and `status`), spread from ProjectCard. PASS only if ProjectActions is named and the problem is described in those terms.
