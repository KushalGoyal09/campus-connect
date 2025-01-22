"use client";

import NotFound from "../not-found";
import { useWebSocket } from "@/hooks/use-webSocket";

export default function NearPage() {
    const { webSocket, error } = useWebSocket("ws://localhost:8080");
    if (error) {
        return <NotFound />;
    }
    return (
        <>
            <h1>Connection established</h1>
        </>
    );
}
