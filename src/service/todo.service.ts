import type { PrismaClient } from "src/generated/prisma/client.js";

class TodoService {
    private prisma: PrismaClient;
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async findAll() {
        return await this.prisma.todo.findMany();
    }

    public async findById(id: string) {
        return await this.prisma.todo.findUnique({
            where: { id: id },
        });
    }

    public async create(title: string, deadline?: Date) {
        return await this.prisma.todo.create({
            data: { title: title, deadline: deadline ? new Date(deadline) : null },
        });
    }

    public async update(id: string, title: string, deadline?: Date, isCompleted?: boolean) {
        return await this.prisma.todo.update({
            where: { id: id },
            data: {
                title: title,
                deadline: deadline ? new Date(deadline) : null,
                isCompleted: isCompleted,
            },
        });
    }

    public async delete(id: string) {
        return await this.prisma.todo.delete({ where: { id: id } });
    }
}

export default TodoService;
