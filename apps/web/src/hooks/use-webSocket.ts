"use client";

import { getCookie } from "@/lib/getCookie";
import { useEffect, useState } from "react";

export const useWebSocket = (url: string) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        setError(null);
        const token = getCookie("token");
        if (!token) {
            setError("No Token found");
            return;
        }
        try {
            const webSocketConnection = new WebSocket(url, token);
            setWs(webSocketConnection);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Connection could not be established");
        }
    }, [url]);

    return {
        webSocket: ws,
        error: error,
    };
};
