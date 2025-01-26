import { WebSocket } from "ws";
import { createMessage } from "./controllers/createMessage";

interface UserConnection {
    userId: string;
    socket: WebSocket;
}

class UserManager {
    private userConnections = new Map<string, UserConnection>();
    private socketToUserId = new Map<WebSocket, string>();

    addUserConnection(userId: string, socket: WebSocket) {
        const existingConnection = this.userConnections.get(userId);
        if (existingConnection) {
            existingConnection.socket.close(4001, "New connection established");
        }

        const connection: UserConnection = {
            userId,
            socket,
        };

        this.userConnections.set(userId, connection);
        this.socketToUserId.set(socket, userId);
    }

    removeUserConnection(userId: string) {
        const connection = this.userConnections.get(userId);
        if (connection) {
            this.socketToUserId.delete(connection.socket);
            this.userConnections.delete(userId);
        }
    }

    getSocketByUserId(userId: string): WebSocket | undefined {
        return this.userConnections.get(userId)?.socket;
    }

    getUserIdBySocket(socket: WebSocket): string | undefined {
        return this.socketToUserId.get(socket);
    }

    broadcastToUsers(userIds: string[], message: string) {
        userIds.forEach((userId) => {
            const connection = this.userConnections.get(userId);
            if (connection) {
                connection.socket.send(message);
            }
        });
    }

    sendToUser(userId: string, message: string) {
        const connection = this.userConnections.get(userId);
        if (connection) {
            connection.socket.send(message);
        }
    }

    sendToSocket(socket: WebSocket, message: string) {
        socket.send(message);
    }

    sendErrorToSocket(socket: WebSocket, error: string) {
        this.sendToSocket(
            socket,
            JSON.stringify({
                type: "error",
                payload: error,
            }),
        );
    }

    async handleMessage(
        payload: { receiverId: string; text: string },
        client: WebSocket,
    ) {
        const { receiverId, text } = payload;
        const receiverSocket = this.getSocketByUserId(receiverId);
        const senderId = this.getUserIdBySocket(client);
        if (!senderId) {
            this.sendErrorToSocket(client, "User ID not found");
            return;
        }
        if (receiverSocket) {
            receiverSocket.send(
                JSON.stringify({
                    type: "messageReceived",
                    payload: {
                        text,
                        senderId,
                    },
                }),
            );
        }
        const success = await createMessage(text, senderId, receiverId);
        if (!success) {
            this.sendErrorToSocket(client, "Failed to send message");
            return;
        }
    }

    getUserCount(): number {
        return this.userConnections.size;
    }
}

export default UserManager;
