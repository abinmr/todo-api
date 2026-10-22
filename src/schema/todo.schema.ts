import { z } from "zod";

export const CreateTodoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    deadline: z.date().optional(),
});

export const UpdateTodoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    deadline: z.string().optional(),
    completed: z.boolean(),
});
