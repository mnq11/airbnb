"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import L, { LatLngTuple, LatLng } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { toast } from "react-hot-toast";
import { MapPinIcon } from "@heroicons/react/24/outline"; // Changed to MapPinIcon

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
 * @property {function} [onLocationSelect] - Optional callback function for location selection
 */
interface MapProps {
  center?: L.LatLngTuple;
  onLocationSelect?: (coords: L.LatLngTuple) => void;
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
    if (center) {
      mapInstance.flyTo(center, mapInstance.getZoom(), { duration });
    }
  }, [center, mapInstance, duration]);

  return null;
};

// Component to handle map clicks for setting marker position
const ClickHandler = ({ onMapClick }: { onMapClick: (latlng: LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
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
const Map: React.FC<MapProps> = ({ center, onLocationSelect }) => {
  const [currentCenter, setCurrentCenter] = useState<LatLngTuple>(center || yemenCoordinates);
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(center || null);
  const [isLocating, setIsLocating] = useState(false);
  const markerRef = useRef<L.Marker>(null);

  // Update internal center and marker when prop changes
  useEffect(() => {
    setCurrentCenter(center || yemenCoordinates);
    setMarkerPosition(center || null);
  }, [center]);

  // Memoize event handlers for the draggable marker
  const markerEventHandlers = useMemo(
    () => ({
      dragend() {
        if (!onLocationSelect) return;

        const marker = markerRef.current;
        if (marker != null) {
          const newLatLng = marker.getLatLng();
          const coords: LatLngTuple = [newLatLng.lat, newLatLng.lng];
          setMarkerPosition(coords); // Update local marker state
          onLocationSelect(coords); // Notify parent component
        }
      },
    }),
    [onLocationSelect]
  );

  // Handle map click to set marker position
  const handleMapClick = useCallback((latlng: LatLng) => {
    if (!onLocationSelect) return;
    
    const coords: LatLngTuple = [latlng.lat, latlng.lng];
    setMarkerPosition(coords);
    onLocationSelect(coords);
  }, [onLocationSelect]);

  // Function to get current device location
  const handleGetCurrentLocation = useCallback(() => {
    if (!onLocationSelect) return;

    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع.");
      return;
    }

    setIsLocating(true);
    toast.loading("جاري تحديد موقعك...", { id: "locating-toast" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: LatLngTuple = [position.coords.latitude, position.coords.longitude];
        setMarkerPosition(coords);
        setCurrentCenter(coords); // Update map center as well
        onLocationSelect(coords);
        toast.success("تم تحديد الموقع بنجاح!", { id: "locating-toast" });
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let message = "لم نتمكن من تحديد موقعك.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "تم رفض إذن تحديد الموقع.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "معلومات الموقع غير متوفرة.";
        } else if (error.code === error.TIMEOUT) {
          message = "انتهت مهلة طلب تحديد الموقع.";
        }
        toast.error(message, { id: "locating-toast" });
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0,
      }
    );
  }, [onLocationSelect]);

  return (
    <div className={`${styles.mapWrapper} relative`}>
      <MapContainer
        center={currentCenter}
        zoom={markerPosition ? 15 : 10} // Zoom in if marker exists
        scrollWheelZoom={true}
        className={styles.mapContainer}
      >
        {/* OpenStreetMap tile layer */}
        <TileLayer url={url} attribution={attribution} />

        {/* Marker: Draggable only if onLocationSelect is provided */}
        {markerPosition && (
          <Marker
            position={markerPosition}
            draggable={!!onLocationSelect}
            eventHandlers={onLocationSelect ? markerEventHandlers : {}}
            ref={markerRef}
          />
        )}

        {/* Map Updater for smooth transitions */}
        <MapUpdater center={currentCenter} />

        {/* Click Handler: Only attach if onLocationSelect is provided */}
        {onLocationSelect && <ClickHandler onMapClick={handleMapClick} />}

      </MapContainer>

      {/* Geolocation Button: Only show if onLocationSelect is provided */}
      {onLocationSelect && (
        <button
          type="button" // Prevent form submission
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="
            absolute top-2 right-2 z-[1000] 
            bg-white p-2 rounded-md shadow-md 
            text-neutral-700 hover:bg-neutral-100 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
          "
          title="استخدام موقعي الحالي"
        >
          {isLocating ? (
             <svg className="animate-spin h-5 w-5 text-neutral-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <MapPinIcon className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default Map;
