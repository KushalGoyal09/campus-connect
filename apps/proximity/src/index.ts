import { getUserId, getUserInfo } from "@kushal/utils";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import { z } from "zod";
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
    longitude: number;
    latitude: number;
}

function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const clientMessageSchema = z.object({
    type: z.enum(["location"]),
    payload: z.object({
        longitude: z.coerce.number(),
        latitude: z.coerce.number(),
    }),
});

function findNearestUsers(
    currentUser: User,
    maxDistance: number = 10,
    limit: number = 5,
): User[] {
    if (!currentUser.location) return [];

    const currentLat = currentUser.location.latitude;
    const currentLon = currentUser.location.longitude;

    const nearestUsers = Array.from(connectedUsers.values())
        .filter((user) => user.id !== currentUser.id && user.location)
        .map((user) => ({
            user,
            distance: calculateDistance(
                currentLat,
                currentLon,
                user.location!.latitude,
                user.location!.longitude,
            ),
        }))
        .filter(({ distance }) => distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
        .map(({ user }) => user);

    return nearestUsers;
}

function broadcastNearestUsers() {
    for (const [client, user] of connectedUsers) {
        if (!user.location) continue;

        const nearestUsers = findNearestUsers(user);

        const nearestUsersMessage = {
            type: "nearestUsers",
            payload: nearestUsers.map((nearUser) => ({
                id: nearUser.id,
                username: nearUser.username,
                name: nearUser.name,
                avatar: nearUser.avatar,
                location: nearUser.location,
            })),
        };

        client.send(JSON.stringify(nearestUsersMessage));
    }
}

setInterval(broadcastNearestUsers, 2000);

const connectedUsers = new Map<WebSocket, User>();

wss.on("connection", async (client) => {
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
    client.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());
            const result = clientMessageSchema.safeParse(data);
            if (!result.success) {
                console.error(result.error);
                return;
            }
            const { type, payload } = result.data;
            if (type === "location") {
                const user = connectedUsers.get(client);
                if (user) user.location = payload;
            }
            console.log(Array.from(connectedUsers.values()));
        } catch (error) {
            console.log(message);
        }
    });
    client.on("close", () => {
        connectedUsers.delete(client);
    });
});
