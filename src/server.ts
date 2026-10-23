import express from "express";
import todoRoute from "./routes/todo.route.js";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: "*" }));
app.use("/api/todo", todoRoute);

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
