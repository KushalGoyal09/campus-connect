import { db } from "@kushal/prisma";

export const getUserInfo = async (userId: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                avatar: true,
                name: true,
                username: true,
            },
        });
        return user;
    } catch (error) {
        return null;
    }
};

export const getUserInfoFromUsername = async (username: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
                avatar: true,
                name: true,
                username: true,
            },
        });
        return user;
    } catch (error) {
        return null;
    }
};
