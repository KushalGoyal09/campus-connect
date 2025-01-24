"use client";

import { useState, useEffect } from "react";

const useUserLocation = () => {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (err) => setError(err.message),
        );
    }, []);

    return {
        location,
        error,
    };
};

export { useUserLocation };
