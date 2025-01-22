import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const getAllUsers = async (userId: string) => {
    try {
        const users = await db.user.findMany({
            where: {
                College: {
                    User: {
                        some: {
                            id: userId,
                        },
                    },
                },
            },
            select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
                email: true,
                bio: true,
                gender: true,
            },
        });
        return users;
    } catch (error) {
        return [];
    }
};

export default getAllUsers;
