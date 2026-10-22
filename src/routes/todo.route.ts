import express from "express";
import { createTodo } from "src/controllers/todo.controller.js";

const router = express.Router();

router.get("/create", createTodo);

export default router;
