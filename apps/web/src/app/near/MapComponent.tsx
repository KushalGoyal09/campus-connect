"use client";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
    ssr: false,
});

// const TileLayer = dynamic(
//     () => import("react-leaflet").then((mod) => mod.TileLayer),
//     { ssr: false },
// );
// const Marker = dynamic(
//     () => import("react-leaflet").then((mod) => mod.Marker),
//     { ssr: false },
// );
// const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
//     ssr: false,
// });

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Leaflet from "leaflet";  

const Map = (props) => {
    
    const { width, height } = props;
    return (
        <div style={{ aspectRatio: width / height }}>
            <DynamicMap {...props} />
        </div>
    );
};

export default Map;
