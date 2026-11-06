import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["active", "paused", "archived"]),
  updatedAt: z.iso.datetime(),
  ownerEmail: z.email(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  ownerEmail: z.email("Enter a valid email"),
});

export type ProjectInput = z.infer<typeof ProjectInputSchema>;
