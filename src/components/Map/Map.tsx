import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLngBoundsExpression } from 'leaflet';

import markerIcon from '../../assets/marker.svg';

// Custom musical note marker icon
const MusicNoteIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

interface Address {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

interface MapProps {
    addresses: Address[];
}

// Oldsum bounds: [south-west, north-east]
const OLDSUM_BOUNDS: LatLngBoundsExpression = [
    [54.734, 8.444],  // south-west corner
    [54.724, 8.466]   // north-east corner
];

// Helper component to fit bounds on mount
const FitBounds: React.FC = () => {
    const map = useMap();
    useEffect(() => {
        map.fitBounds(OLDSUM_BOUNDS, { padding: [0, 0] });
    }, [map]);
    return null;
};

const MapComponent: React.FC<MapProps> = ({ addresses }) => {
    return (
        <MapContainer 
            bounds={OLDSUM_BOUNDS}
            minZoom={14}
            maxZoom={18}
            style={{ 
                height: 'calc(100vh - 80px)', 
                width: '100%', 
                borderRadius: '0',
                mixBlendMode: 'screen',
                filter: 'brightness(2.5) contrast(1.5)'
            }}
            zoomControl={false}
        >
            <FitBounds />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            />
            {addresses.map((addr) => (
                <Marker key={addr.id} position={[addr.lat, addr.lng]} icon={MusicNoteIcon}>
                    <Popup>
                        <strong>{addr.name}</strong>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
