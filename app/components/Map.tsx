"use client";
import React, { useEffect } from "react";
import L, { LatLngTuple } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import styles from "@/app/components/Map.module.css";

/**
 * Configure Leaflet default marker icons
 * 
 * This fixes the common issue with Leaflet markers not displaying correctly in Next.js
 * by explicitly setting the icon URLs.
 */
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

/**
 * Interface for Map component props
 * 
 * @interface MapProps
 * @property {L.LatLngTuple} [center] - Optional center coordinates for the map
 *                                      If not provided, defaults to Yemen coordinates
 */
interface MapProps {
  center?: L.LatLngTuple;
}

/**
 * Interface for MapUpdater component props
 * 
 * @interface MapUpdaterProps
 * @property {LatLngTuple} [center] - Optional center coordinates to fly to
 * @property {number} [duration] - Animation duration in seconds (default: 1)
 */
interface MapUpdaterProps {
  center?: LatLngTuple;
  duration?: number;
}

// OpenStreetMap tile layer URL
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// Map attribution text (in Arabic)
const attribution =
  " النقطة على الخريطة لاتحدد بدقة انما تحدد المنطقة التقريبية فقط</a> ";
// Default coordinates for Yemen
const yemenCoordinates: LatLngTuple = [15.369445, 44.191456];

/**
 * MapUpdater Component
 * 
 * A utility component that uses the useMap hook from react-leaflet to
 * programmatically control the map view. It animates the map to the
 * specified center coordinates when they change.
 * 
 * @component
 * @param {MapUpdaterProps} props - Component props
 * @returns {null} This component doesn't render anything visible
 */
const MapUpdater: React.FC<MapUpdaterProps> = ({ center, duration = 1 }) => {
  const mapInstance = useMap();

  // Effect to animate the map to new center coordinates when they change
  useEffect(() => {
    const targetCenter = center || yemenCoordinates;
    mapInstance.flyTo(targetCenter, mapInstance.getZoom(), { duration });
  }, [center, mapInstance, duration]); // Removed yemenCoordinates from dependencies

  return null;
};

/**
 * Map Component
 * 
 * A reusable map component built with react-leaflet that:
 * - Displays an interactive OpenStreetMap
 * - Shows a marker at the specified location (if provided)
 * - Provides smooth animation when coordinates change
 * - Has consistent styling with custom borders and shadows
 * - Supports responsive layout
 * 
 * Used throughout the application to:
 * - Display property locations on listing detail pages
 * - Show search results on a map
 * - Allow location selection when creating listings
 * 
 * @component
 * @param {MapProps} props - Component props
 * @returns {JSX.Element} Rendered map with optional marker
 */
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
        {/* OpenStreetMap tile layer */}
        <TileLayer url={url} attribution={attribution} />
        
        {/* Only show marker if center coordinates are provided */}
        {center && <Marker position={center} />}
        
        {/* MapUpdater component for smooth animations when center changes */}
        <MapUpdater center={center || yemenCoordinates} />
      </MapContainer>
    </div>
  );
};

export default Map;
