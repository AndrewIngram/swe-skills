---
type: llm
---

The reply flags that `src/components/EditProjectForm.tsx` validates by hand in `onSubmit` (trim, length and email checks with `setError`) although `ProjectInputSchema` encodes the same rules and `@hookform/resolvers` is installed, and recommends `zodResolver(ProjectInputSchema)`. PASS only if this specific pattern is identified.
