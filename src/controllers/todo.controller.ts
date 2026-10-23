import type { Request, Response } from "express";
import { prisma } from "src/config/db.js";
import StatusCode from "src/constants/statusCode.js";
import { CreateTodoSchema, ParmsSchema, UpdateTodoSchema } from "src/schema/todo.schema.js";
import TodoService from "src/service/todo.service.js";

const todoService = new TodoService(prisma);

export const getTodos = async (req: Request, res: Response) => {
    try {
        const todo = await todoService.findAll();
        return res.status(StatusCode.success).json(todo);
    } catch (err) {
        console.error(err);
        return res.status(StatusCode.serverError).json({ error: "Servere error" });
    }
};

export const getTodoById = async (req: Request, res: Response) => {
    try {
        const result = ParmsSchema.safeParse(req.params.id);

        if (!result.success) {
            return res.status(StatusCode.badRequest).json({
                error: "id is required",
            });
        }

        const todo = await todoService.findById(result.data.id);

        return res.status(StatusCode.success).json(todo);
    } catch (err) {
        console.error(err);
        return res.status(StatusCode.serverError).json({ error: "Servere error" });
    }
};

export const createTodo = async (req: Request, res: Response) => {
    try {
        const result = CreateTodoSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(StatusCode.badRequest).json({
                error: result.error.issues[0]?.message,
            });
        }

        const { title, deadline } = result.data;

        if (!title || title.trim() === "") {
            return res.status(StatusCode.badRequest).json({ error: "Title is required" });
        }

        const todo = await todoService.create(title, deadline);

        return res.status(StatusCode.created).json(todo);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(StatusCode.serverError).json({ error: "Failed to create todo", detail: err.message });
        } else {
            console.error(err);
            return res.status(StatusCode.serverError).json({ error: "Servere error" });
        }
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const parmsResult = ParmsSchema.safeParse(req.params.id);

        if (!parmsResult.success) {
            return res.status(StatusCode.badRequest).json({ error: parmsResult.error.issues[0]?.message });
        }

        const { id } = parmsResult.data;

        const result = UpdateTodoSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(StatusCode.badRequest).json({ error: result.error.issues[0]?.message });
        }

        const { title, deadline, isCompleted } = result.data;

        const todo = await todoService.update(id, title, deadline, isCompleted);

        return res.status(StatusCode.success).json(todo);
    } catch (err: unknown) {
        console.error(err);
        return res.status(StatusCode.serverError).json({ error: "Servere error" });
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(StatusCode.badRequest).json({ error: "id is required" });
        }

        const result = await todoService.delete(id);

        return res.status(StatusCode.success).json(result);
    } catch (err) {
        console.error(err);
        return res.status(StatusCode.serverError).json({ error: "Servere error" });
    }
};
