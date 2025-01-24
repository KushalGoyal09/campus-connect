"use client";

import NotFound from "@/components/NotFound";
import ErrorPage from "@/components/ErrorPage";
import { useWebSocket } from "@/hooks/use-webSocket";
import { useEffect, useState } from "react";
import { useUserLocation } from "@/hooks/use-location";

export default function NearPage() {
    const { webSocket, error } = useWebSocket("ws://localhost:8080");
    const [messages, setMessages] = useState<Array<string>>([]);
    // const { location, error: locationErr } = useUserLocation();
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    useEffect(() => {
        if (webSocket) {
            const handleMessage = (event: MessageEvent) => {
                setMessages((prev) => [...prev, event.data]);
                console.log("Message received:", event.data);
            };
            webSocket.addEventListener("message", handleMessage);
            return () => {
                webSocket.removeEventListener("message", handleMessage);
            };
        }
    }, [webSocket]);

    useEffect(() => {
        const getLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => console.log(err.message),
            );
        };
        const intervalId = setInterval(getLocation, 5000);

        return () => clearInterval(intervalId); 
    }, []);

    useEffect(() => {
        if (location && webSocket) {
            webSocket.send(
                JSON.stringify({
                    type: "location",
                    payload: location,
                }),
            );
        }
    }, [location, webSocket]);

    if (error) {
        console.log(error);
        return <ErrorPage customMessage={error} />;
    }

    // if (locationErr) {
    //     console.log(locationErr);
    //     return <ErrorPage customMessage={locationErr} />;
    // }

    if (!webSocket) {
        return;
    }

    const handleClick = () => {
        if (webSocket) {
            webSocket.send("Hello from the client");
        }
    };

    // webSocket.send("Kushal Goyal");
    // webSocket.send(JSON.stringify({
    //     name: "Kushal Goyal",
    //     class: "High Class"
    // }))
    return (
        <>
            <h1>Connection established</h1>
            {messages.map((message, index) => {
                return (
                    <div key={index}>
                        <h1>{message}</h1>
                    </div>
                );
            })}
            <button onClick={handleClick}>Send Hello</button>
        </>
    );
}
