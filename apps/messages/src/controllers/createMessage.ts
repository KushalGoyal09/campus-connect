import { db } from "@kushal/prisma";

export const createMessage = async (
    text: string,
    senderId: string,
    receiverId: string,
) => {
    try {
        await db.message.create({
            data: {
                text,
                senderId,
                receiverId,
            },
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
