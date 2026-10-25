import express from "express";
import { createTodo, deleteTodo, getTodoById, getTodos, markTodoComplete, markTodoUncomplete, updateTodo } from "src/controllers/todo.controller.js";

const router = express.Router();

router.get("/", getTodos);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.patch("/:id", updateTodo);
router.patch("/:id/complete", markTodoComplete)
router.patch("/:id/uncomplete", markTodoUncomplete);
router.delete("/:id", deleteTodo);

export default router;
