import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const toggleLike = async (userId: string, tweetId: string) => {
    if (!userId) {
        return {
            success: false,
            message: "Invalid token",
        };
    }
    try {
        const data = await db.like.findUnique({
            where: {
                userId_tweetId: {
                    tweetId,
                    userId,
                },
            },
        });
        if (data) {
            await db.like.delete({
                where: {
                    userId_tweetId: {
                        tweetId,
                        userId,
                    },
                },
            });
            return {
                success: true,
                message: "Like removed",
            };
        } else {
            await db.like.create({
                data: {
                    tweetId,
                    userId,
                },
            });
            return {
                success: true,
                message: "Like added",
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "An unexpected error occured",
        };
    }
};

export default toggleLike;
