"use client";

import NotFound from "@/components/NotFound";
import { useWebSocket } from "@/hooks/use-webSocket";

export default function NearPage() {
    const { webSocket, error } = useWebSocket("ws://localhost:8080");
    if (error || !webSocket) {
        return <NotFound />;
    }
    webSocket.onopen = (event) => {
        console.log("The connection is connected");
        webSocket.send("I am conneected");
    }

    // webSocket.send("Kushal Goyal");
    // webSocket.send(JSON.stringify({
    //     name: "Kushal Goyal",
    //     class: "High Class"
    // }))
    return (
        <>
            <h1>Connection established</h1>
        </>
    );
}
