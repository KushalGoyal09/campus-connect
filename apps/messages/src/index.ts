import { WebSocketServer } from "ws";
import { getUserId } from "@kushal/utils";
import { z } from "zod";
import UserManager from "./UserManager";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const wss = new WebSocketServer({ port: 5000 });
const userManager = new UserManager();

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

    userManager.addUserConnection(userId, client);

    client.on("message", async (message) => {
        let data;
        try {
            data = JSON.parse(message.toString());
        } catch (error) {
            userManager.sendErrorToSocket(client, "Invalid JSON");
            return;
        }
        const result = messageSchema.safeParse(data);
        if (!result.success) {
            userManager.sendErrorToSocket(client, "Invalid message");
            return;
        }
        const { type, payload } = result.data;
        if (type === "sendMessage") {
            userManager.handleMessage(payload, client);
        }
    });
    client.on("close", () => {
        userManager.removeUserConnection(userId);
    });
});
