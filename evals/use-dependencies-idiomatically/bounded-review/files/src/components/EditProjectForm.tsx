import { useForm } from "react-hook-form";
import { useUpdateProject } from "../hooks/useProjects";
import type { Project, ProjectInput } from "../lib/schemas";

export function EditProjectForm({ project, onDone }: { project: Project; onDone: () => void }) {
  const mutation = useUpdateProject(project.id);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    defaultValues: { name: project.name, ownerEmail: project.ownerEmail },
  });

  const onSubmit = async (values: ProjectInput) => {
    const name = values.name.trim();
    if (!name) {
      setError("name", { message: "Name is required" });
      return;
    }
    if (name.length > 80) {
      setError("name", { message: "Name must be 80 characters or fewer" });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.ownerEmail)) {
      setError("ownerEmail", { message: "Enter a valid email" });
      return;
    }
    await mutation.mutateAsync({ name, ownerEmail: values.ownerEmail });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} aria-label="Name" />
      {errors.name && <span role="alert">{errors.name.message}</span>}
      <input {...register("ownerEmail")} aria-label="Owner email" />
      {errors.ownerEmail && <span role="alert">{errors.ownerEmail.message}</span>}
      <button type="submit" disabled={isSubmitting}>
        Save
      </button>
    </form>
  );
}
