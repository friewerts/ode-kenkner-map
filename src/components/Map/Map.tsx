import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icon not showing correctly in standard Webpack/Vite builds
const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Address {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

interface MapProps {
    addresses: Address[];
}

const MapComponent: React.FC<MapProps> = ({ addresses }) => {
    // Oldsum coordinates
    const position: [number, number] = [54.7294, 8.4551];

    return (
        <MapContainer 
            center={position} 
            zoom={16} 
            minZoom={16} 
            style={{ 
                height: 'calc(100vh - 80px)', 
                width: '100%', 
                borderRadius: '12px',
                // Use Dark Matter tiles (black bg, light lines).
                // 'lighten' or 'screen' blend mode will make the black background transparent 
                // (showing the green body bg) and keep the light lines visible.
                mixBlendMode: 'screen',
                filter: 'brightness(2.5) contrast(1.5)'
            }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            />
            {addresses.map((addr) => (
                <Marker key={addr.id} position={[addr.lat, addr.lng]}>
                    <Popup>
                        <strong>{addr.name}</strong>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
