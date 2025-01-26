import { WebSocketServer, WebSocket } from "ws";
import { db } from "@kushal/prisma";
import { getUserId } from "@kushal/utils";
import { z } from "zod";

const wss = new WebSocketServer({ port: 5000 });

const userMap = new Map<string, WebSocket>();

const messageSchema = z.object({
    type: z.enum(["sendMessage"]),
    payload: z.object({
        receiverId: z.string(),
        text: z.string().trim().min(1),
    }),
});

wss.on("connection", async (client) => {
    const token = client.protocol;
    const userId = await getUserId(token);
    if (!userId) {
        client.close(1008, "No token found");
        return;
    }

    userMap.set(userId, client);

    client.on("message", async (message) => {
        const data = JSON.parse(message.toString());
        const result = messageSchema.safeParse(data);
        if (!result.success) {
            client.send(
                JSON.stringify({
                    type: "error",
                    payload: "Invalid message",
                }),
            );
            return;
        }
        const { type, payload } = result.data;
        if (type === "sendMessage") {
            const { receiverId, text } = payload;
            const receiverSocket = userMap.get(receiverId);
            if (receiverSocket) {
                receiverSocket.send(
                    JSON.stringify({
                        type: "messageReceived",
                        payload: {
                            text,
                            senderId: userId,
                        },
                    }),
                );
            }
            await db.message.create({
                data: {
                    text,
                    senderId: userId,
                    receiverId,
                },
            });
        }
    });
});
