import express from "express";
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from "src/controllers/todo.controller.js";

const router = express.Router();

router.get("/", getTodos);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
