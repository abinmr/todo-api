import { z } from "zod";

export const ParamsSchema = z.object({
    id: z.string().uuid("Please provide a valid UUID"),
});

// Alias for backwards compatibility
export const ParmsSchema = ParamsSchema;

export const CreateTodoSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    deadline: z.coerce.date().optional(),
});

export const UpdateTodoSchema = z.object({
    title: z.string().trim().min(1, "Title cannot be empty").optional(),
    deadline: z.coerce.date().nullable().optional(),
    isCompleted: z.boolean().optional(),
});

export type ParamsInput = z.infer<typeof ParamsSchema>;
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
