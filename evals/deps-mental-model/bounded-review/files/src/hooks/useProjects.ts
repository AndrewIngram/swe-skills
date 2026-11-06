import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, updateProject } from "../lib/api";
import type { ProjectInput } from "../lib/schemas";

export const projectsKey = ["projects"] as const;

export function useProjects() {
  return useQuery({ queryKey: projectsKey, queryFn: fetchProjects });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectInput) => updateProject(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsKey }),
  });
}
