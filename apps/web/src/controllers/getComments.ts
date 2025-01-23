import {db} from "@kushal/prisma"

interface Comment {
    createdAt: Date;
    text: string;
    User: {
        username: string;
        name: string;
        avatar: string | null;
    };
}

interface CommentResponse {
    success: boolean;
    message: string;
    comments: Comment[];
}

const getComments = async (tweetId: string): Promise<CommentResponse> => {
    try {
        const comments = await db.comment.findMany({
            where: {
                tweetId,
            },
            select: {
                User: {
                    select: {
                        name: true,
                        username: true,
                        avatar: true,
                    },
                },
                text: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            success: true,
            message: "Comments retrieved",
            comments,
        };
    } catch (error) {
        return {
            success: false,
            message: "Could not get comments",
            comments: [],
        };
    }
};

export default getComments;
