import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const addComment = async (userId: string, tweetId: string, text: string) => {
    if (!userId) {
        return {
            success: false,
            message: "Invalid user",
        };
    }
    try {
        const comment = await db.comment.create({
            data: {
                text,
                userId,
                tweetId,
            },
            select: {
                text: true,
                id: true,
                createdAt: true,
            },
        });
        return {
            success: true,
            message: "Comment added",
            comment,
        };
    } catch (error) {
        return {
            success: false,
            message: "Could not add comment",
        };
    }
};

export default addComment;
