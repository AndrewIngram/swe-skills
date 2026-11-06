---
type: llm
weight: 2
---

The reply flags `src/components/OwnerBadge.tsx` because it types its `owner` prop with `ProjectCard_project$data`, a type generated for ProjectCard's fragment, instead of declaring its own fragment. It explains this as breaking Relay's data masking or fragment colocation: OwnerBadge's data needs are declared in another component's fragment, so editing ProjectCard's fragment can break OwnerBadge. It recommends giving OwnerBadge its own fragment, spread from ProjectCard. PASS only if OwnerBadge is named and the problem is described in terms of masking, colocation, or one component depending on another component's fragment.
