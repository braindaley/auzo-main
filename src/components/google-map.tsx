
"use client";

import { APIProvider, Map } from '@vis.gl/react-google-maps';

const GoogleMap = () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="absolute inset-0 bg-muted" />
        );
    }
    
    return (
        <APIProvider apiKey={apiKey}>
            <div className="absolute inset-0">
                <Map
                    defaultCenter={{ lat: 34.0522, lng: -118.2437 }} // Default to Los Angeles
                    defaultZoom={10}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    mapId="auzo_map" // Optional: for custom styling in Google Cloud Console
                />
            </div>
        </APIProvider>
    );
};

export default GoogleMap;
