import { getUserId } from "@/lib/auth";
import { getUserInfo } from "@/lib/getUserInfo";
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({
    port: 8080,
});

interface User {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
    location?: Location
}

interface Location {
    longitude: string;
    latitude: string;
}

const connectedUsers = new Map<WebSocket, User>();

wss.on("connection", async (client) => {
    console.log("New Connection recieved");
    const token = client.protocol;
    const userId = await getUserId(token);
    if (!userId) {
        client.close(1008, "No token found");
        return;
    }
    const user = await getUserInfo(userId);
    if (!user) {
        client.close(1007, "No user found");
        return;
    }
    connectedUsers.set(client, user);
    console.log("Connected user");

    client.on('message', (data) => {
        console.log(data)
    })

    client.on("close", () => {
        console.log("One connection disconnected");
    });
});

//Events:
// location - get the latest location of the user in every 2 seconds. (from client to the server)
// Nearest - get all the people near me (get the object)
