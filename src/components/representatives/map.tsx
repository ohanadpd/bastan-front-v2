'use client';
import { LatLngTuple, Icon } from 'leaflet';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Representation } from '@/types/representation.types';

// Component to update map center dynamically with smooth animation
function MapUpdater({ center, zoom=16 }: { center: [number, number], zoom: number }) {
    const map = useMap();
    
    useEffect(() => {
        // Use flyTo for smooth animated transition with optimized settings
        map.flyTo(center, zoom, {
            duration: 1, // Reduced animation duration for faster response
            easeLinearity: 0.25, // Slightly higher for smoother feel
            animate: true,
        });
    }, [center, map, zoom]);
    
    return null;
}

export default function AgenciesMap({ selectedAgency, initialData }: { selectedAgency: {center: [number, number], zoom: number}, initialData: Representation[] }) {
    const [center, setCenter] = React.useState(selectedAgency.center)
    const [zoom, setZoom] = React.useState(selectedAgency.zoom)
    const [primaryColor, setPrimaryColor] = React.useState('#CE9F2B') // Default color
    
    // Get primary color from CSS variable after component mounts
    useEffect(() => {
        const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#CE9F2B';
        setPrimaryColor(color);

        document.getElementsByClassName("leaflet-control-attribution")[0]?.remove();
    }, [])
    
    // Memoize custom marker icon to prevent recreation on every render
    const customIcon = useMemo(() => new Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="36" viewBox="0 0 46 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M44.9535 17.7001C42.257 5.83568 31.9078 0.494141 22.8169 0.494141C22.8169 0.494141 22.8169 0.494141 22.7912 0.494141C13.726 0.494141 3.3511 5.81 0.654651 17.6744C-2.34996 30.9255 5.76507 42.1479 13.1097 49.21C15.8318 51.8294 19.3244 53.1391 22.8169 53.1391C26.3094 53.1391 29.802 51.8294 32.4984 49.21C39.8431 42.1479 47.9581 30.9512 44.9535 17.7001ZM22.8169 30.566C18.3485 30.566 14.7276 26.945 14.7276 22.4766C14.7276 18.0082 18.3485 14.3873 22.8169 14.3873C27.2853 14.3873 30.9063 18.0082 30.9063 22.4766C30.9063 26.945 27.2853 30.566 22.8169 30.566Z" fill="${primaryColor}"/>
            </svg>
        `),
        iconSize: [32, 36], // Reduced size for better performance
        iconAnchor: [16, 36],
        popupAnchor: [0, -36],
    }), [primaryColor])

    useEffect(() => {
        setCenter(selectedAgency.center)
        setZoom(selectedAgency.zoom)
    }, [selectedAgency])

    return (
        <div className="w-full h-full rounded-[10px] overflow-hidden">
            <MapContainer
                center={center as LatLngTuple}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
                preferCanvas={true}
                zoomControl={true}
                doubleClickZoom={false}
                touchZoom={true}
            >
                <MapUpdater center={center} zoom={zoom} />
                
                <TileLayer
                    attribution=''
                    url="https://basemap.yazd.ir/tiles/osm/{z}/{x}/{y}.png"
                    maxZoom={19}
                    keepBuffer={4}
                    updateWhenZooming={false}
                    updateWhenIdle={true}
                />
                {useMemo(() => 
                    initialData.map((agency) => (
                        <Marker key={agency.pk} position={[agency.longitude, agency.latitude]} icon={customIcon}>
                            {agency.name && <Popup className='bg-white text-[#303030] text-lg !font-yekanBakh rounded-[10px] overflow-hidden'>
                                {agency.name}
                            </Popup>}
                        </Marker>
                    ))
                , [customIcon, initialData])}
            </MapContainer>
        </div>
    );
}