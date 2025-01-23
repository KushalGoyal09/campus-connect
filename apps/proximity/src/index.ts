import { getUserId } from "@kushal/utils";
import { getUserInfo } from "@kushal/utils";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const wss = new WebSocketServer({
    port: 8080,
});

interface User {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
    location?: Location;
}

interface Location {
    longitude: string;
    latitude: string;
}

const connectedUsers = new Map<WebSocket, User>();

wss.on("connection", async (client) => {
    console.log("New Connection recieved");
    const token = client.protocol;
    console.log(token);
    const userId = await getUserId(token);
    console.log(userId);
    if (!userId) {
        client.close(1008, "No token found");
        return;
    }
    const user = await getUserInfo(userId);
    console.log(user);
    if (!user) {
        client.close(1007, "No user found");
        return;
    }
    connectedUsers.set(client, user);
    console.log("Connected user");
    client.on("message", (data) => {
        console.log("soem");
        console.log(data);
    });
    client.on("close", () => {
        console.log("One connection disconnected");
    });
});

// Events:
// location - get the latest location of the user in every 2 seconds. (from client to the server)
// Nearest - get all the people near me (get the object)

