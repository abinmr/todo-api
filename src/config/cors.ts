import type { CorsOptions } from "node_modules/@types/cors/index.js";

const corsOptions: CorsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5173/"],
    methods: "GET,POST,PATCH,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

export default corsOptions;
