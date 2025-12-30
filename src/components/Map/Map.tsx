import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
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

// User location indicator component
const UserLocation: React.FC = () => {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const [hasCentered, setHasCentered] = useState(false);
    
    const userIcon = React.useMemo(() => L.divIcon({
        className: 'user-location-marker',
        html: '<div class="user-location-dot"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    }), []);

    const map = useMapEvents({
        locationfound(e) {
            const bounds = L.latLngBounds(OLDSUM_BOUNDS);
            if (bounds.contains(e.latlng)) {
                setPosition(e.latlng);
                if (!hasCentered) {
                    map.setView(e.latlng, 15);
                    setHasCentered(true);
                }
            } else {
                setPosition(null);
            }
        },
        locationerror() {
            setPosition(null);
        }
    });

    useEffect(() => {
        map.locate({ watch: true, enableHighAccuracy: true });
    }, [map]);

    if (!position) return null;

    return <Marker position={position} icon={userIcon} />;
};

// Helper component to fit bounds on mount
const FitBounds: React.FC = () => {
    const map = useMap();
    useEffect(() => {
        map.fitBounds(OLDSUM_BOUNDS, { padding: [0, 0] });
    }, [map]);
    return null;
};

const MapComponent: React.FC<MapProps> = ({ addresses }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async () => {
        setIsSharing(true);
        try {
            const response = await fetch('/kenkner-map-2025-v2.png');
            const blob = await response.blob();
            const file = new File([blob], 'kenkner-map-2025.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Oldsumer Kenkner Karte',
                    text: 'Schau mal, hier kann man in Oldsum überall kenknern!',
                     url: 'https://kenknen.oldsum.de'
                });
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'kenkner-map-2025.png';
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Sharing failed:', error);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div ref={mapRef} style={{ position: 'relative', height: '100svh', width: '100%' }}>
            <MapContainer 
                bounds={OLDSUM_BOUNDS}
                minZoom={14}
                maxZoom={18}
                style={{ 
                    height: '100%', 
                    width: '100%', 
                    borderRadius: '0',
                    mixBlendMode: 'screen',
                    filter: 'brightness(2) contrast(1.1)',
                    background: '#425B44'
                }}
                zoomControl={false}
            >
                <FitBounds />
                <UserLocation />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    crossOrigin="anonymous"
                />
                {addresses.map((addr) => (
                    <Marker key={addr.id} position={[addr.lat, addr.lng]} icon={MusicNoteIcon}>
                        <Popup>
                            <strong>{addr.name}</strong>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            <button 
                className="share-button" 
                onClick={handleShare}
                disabled={isSharing}
                title={isSharing ? "Wird vorbereitet..." : "Karte als Bild teilen"}
                aria-label="Karte teilen"
            >
                {isSharing ? (
                    <div className="loader" style={{ width: '20px', height: '20px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1-1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                    </svg>
                )}
            </button>
        </div>
    );
};

export default MapComponent;
