"use client";

import { getCookie } from "@kushal/utils";
import { useEffect, useState } from "react";

export const useWebSocket = (url: string) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) return;
        const token = getCookie("token");
        if (!token) {
            setError("No token found");
            return;
        }
        let webSocketConnection: WebSocket | null = null;

        try {
            webSocketConnection = new WebSocket(url, token);
            setWs(webSocketConnection);
            setError(null);

            webSocketConnection.onopen = () => console.log("WebSocket connection opened");
            webSocketConnection.onerror = (e) => setError("WebSocket error occurred");
            webSocketConnection.onclose = () => console.log("WebSocket connection closed");
        } catch (err) {
            console.error(err);
            setError("Connection could not be established");
        }

        return () => {
            if (webSocketConnection) {
                webSocketConnection.close();
                console.log("WebSocket connection cleaned up");
            }
            setWs(null);
        };
    }, [url]);

    return {
        webSocket: ws,
        error,
    };
};
