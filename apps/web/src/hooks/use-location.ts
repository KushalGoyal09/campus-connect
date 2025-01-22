"use client";

import { useState, useEffect } from "react";

const useUserLocation = () => {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => setError(err.message),
            );
            navigator.geolocation.getCurrentPosition((data) => {
                console.log(data);
            });
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    return {
        location,
        error,
    };
};

export { useUserLocation };
