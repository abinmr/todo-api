import type { Request, Response } from "express";
import { Prisma } from "src/generated/prisma/client.js";
import { prisma } from "src/config/db.js";
import StatusCode from "src/constants/statusCode.js";
import { CreateTodoSchema, ParamsSchema, UpdateTodoSchema } from "src/schema/todo.schema.js";
import TodoService from "src/service/todo.service.js";

const todoService = new TodoService(prisma);

export const getTodos = async (req: Request, res: Response) => {
    try {
        const todos = await todoService.findAll();
        return res.status(StatusCode.success).json(todos);
    } catch (err) {
        console.error("Error fetching todos:", err);
        return res.status(StatusCode.serverError).json({ error: "Server error" });
    }
};

export const getTodoById = async (req: Request, res: Response) => {
    try {
        const paramResult = ParamsSchema.safeParse(req.params);

        if (!paramResult.success) {
            return res.status(StatusCode.badRequest).json({
                error: paramResult.error.issues[0]?.message ?? "Invalid todo ID",
            });
        }

        const todo = await todoService.findById(paramResult.data.id);

        if (!todo) {
            return res.status(StatusCode.notFound).json({
                error: "Todo not found",
            });
        }

        return res.status(StatusCode.success).json(todo);
    } catch (err) {
        console.error("Error fetching todo by id:", err);
        return res.status(StatusCode.serverError).json({ error: "Server error" });
    }
};

export const createTodo = async (req: Request, res: Response) => {
    try {
        const result = CreateTodoSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(StatusCode.badRequest).json({
                error: result.error.issues[0]?.message ?? "Invalid input",
            });
        }

        const todo = await todoService.create(result.data);

        return res.status(StatusCode.created).json(todo);
    } catch (err: unknown) {
        console.error("Error creating todo:", err);
        if (err instanceof Error) {
            return res.status(StatusCode.serverError).json({ error: "Failed to create todo", detail: err.message });
        }
        return res.status(StatusCode.serverError).json({ error: "Server error" });
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const paramResult = ParamsSchema.safeParse(req.params);
        if (!paramResult.success) {
            return res.status(StatusCode.badRequest).json({
                error: paramResult.error.issues[0]?.message ?? "Invalid todo ID",
            });
        }

        const bodyResult = UpdateTodoSchema.safeParse(req.body);
        if (!bodyResult.success) {
            return res.status(StatusCode.badRequest).json({
                error: bodyResult.error.issues[0]?.message ?? "Invalid input",
            });
        }

        const todo = await todoService.update(paramResult.data.id, bodyResult.data);

        return res.status(StatusCode.success).json(todo);
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            return res.status(StatusCode.notFound).json({ error: "Todo not found" });
        }
        console.error("Error updating todo:", err);
        return res.status(StatusCode.serverError).json({ error: "Server error" });
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const paramResult = ParamsSchema.safeParse(req.params);
        if (!paramResult.success) {
            return res.status(StatusCode.badRequest).json({
                error: paramResult.error.issues[0]?.message ?? "Invalid todo ID",
            });
        }

        const result = await todoService.delete(paramResult.data.id);

        return res.status(StatusCode.success).json({
            message: "Todo deleted successfully",
            data: result,
        });
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            return res.status(StatusCode.notFound).json({ error: "Todo not found" });
        }
        console.error("Error deleting todo:", err);
        return res.status(StatusCode.serverError).json({ error: "Server error" });
    }
};
