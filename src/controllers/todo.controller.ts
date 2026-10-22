import type { Request, Response } from "express";
import { prisma } from "src/config/db.js";
import StatusCode from "src/constants/statusCode.js";

interface CreateTodoInput {
    title: string;
    deadline?: string;
}

export const createTodo = async (req: Request, res: Response) => {
    try {
        const { title, deadline } = req.body as CreateTodoInput;

        if (!title || title.trim() === "") {
            return res.status(StatusCode.badRequest).json({ error: "Title is required" });
        }

        const todo = await prisma.todo.create({
            data: { title: title, deadline: deadline ? new Date(deadline) : null },
        });
        return res.status(StatusCode.created).json(todo);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(StatusCode.serverError).json({ error: "Failed to create todo", detail: err.message });
        } else {
            console.error(err);
        }
    }
};
