'use client';
import React, {useEffect} from "react";
import L, {LatLngTuple} from "leaflet";
import {MapContainer, Marker, TileLayer, useMap} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import styles from '@/app/components/Map.module.css';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});
interface MapProps {
    center?: L.LatLngTuple;
}
interface MapUpdaterProps {
    center?: LatLngTuple;
    duration?: number;
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = ' النقطة على الخريطة لاتحدد بدقة انما تحدد المنطقة التقريبية فقط</a> ';
const MapUpdater: React.FC<MapUpdaterProps> = ({ center, duration = 1 }) => {
    const yemenCoordinates: LatLngTuple = [15.369445, 44.191456];
    const mapInstance = useMap();

    useEffect(() => {
        if (center) {
            mapInstance.flyTo(center, mapInstance.getZoom(), { duration });
        } else {
            mapInstance.flyTo(yemenCoordinates, mapInstance.getZoom(), { duration });
        }
    }, [center, yemenCoordinates, mapInstance, duration]);


    return null;
};

const Map: React.FC<MapProps> = ({ center }) => {
    const yemenCoordinates: L.LatLngTuple = [15.369445, 44.191456];
    const zoomLevel = 13;

    return (
        <div className={styles.mapWrapper}>
            <MapContainer
                center={center || yemenCoordinates}
                zoom={zoomLevel}
                scrollWheelZoom={true}
                className={styles.mapContainer}
            >
                <TileLayer url={url} attribution={attribution} />
                {center && <Marker position={center} />}
                <MapUpdater center={center || yemenCoordinates} />
            </MapContainer>
        </div>
    );
};

export default Map;