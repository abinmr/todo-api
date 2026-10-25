import type { PrismaClient } from "src/generated/prisma/client.js";
import type { CreateTodoInput, UpdateTodoInput } from "src/schema/todo.schema.js";

class TodoService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async findAll() {
        return await this.prisma.todo.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    public async findById(id: string) {
        return await this.prisma.todo.findUnique({
            where: { id },
        });
    }

    public async create(data: CreateTodoInput) {
        return await this.prisma.todo.create({
            data: {
                title: data.title,
                deadline: data.deadline ?? null,
            },
        });
    }

    public async update(id: string, data: UpdateTodoInput) {
        const updateData: {
            title?: string;
            deadline?: Date | null;
            isCompleted?: boolean;
        } = {};

        if (data.title !== undefined) updateData.title = data.title;
        if (data.deadline !== undefined) updateData.deadline = data.deadline;
        if (data.isCompleted !== undefined) updateData.isCompleted = data.isCompleted;

        return await this.prisma.todo.update({
            where: { id },
            data: updateData,
        });
    }

    public async updateCompletionStatus(id: string, isCompleted: boolean) {
        return await this.prisma.todo.update({
            where: { id: id },
            data: { isCompleted },
        });
    }

    public async delete(id: string) {
        return await this.prisma.todo.delete({
            where: { id },
        });
    }
}

export default TodoService;
