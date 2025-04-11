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

  // Function to open Google Maps directions
  const handleGetDirections = useCallback(() => {
    if (markerPosition) {
      const lat = markerPosition[0];
      const lng = markerPosition[1];
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error("لا يوجد موقع محدد للحصول على الاتجاهات.");
    }
  }, [markerPosition]);

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

      {/* NEW: Google Maps Directions Button */}
      {markerPosition && !onLocationSelect && ( // Show only if marker exists AND not in selection mode
          <button
            type="button"
            onClick={handleGetDirections}
            className="
              absolute bottom-2 right-2 z-[1000] 
              bg-blue-600 hover:bg-blue-700 text-white
              p-2 rounded-md shadow-md 
              transition flex items-center gap-1.5 text-sm
            "
            title="الحصول على الاتجاهات في خرائط جوجل"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872l.058.088c.3.44.849.725 1.386.725h4.305a1.125 1.125 0 0 1 .848.354l.048.062c.303.396.408.92.308 1.425a1.125 1.125 0 0 1-.247.654l-.06.086c-.4.566-.414 1.316-.027 1.884l.055.08c.34.496.885.78 1.442.78h1.472c.477 0 .92-.184 1.25-.518l.046-.046c.35-.35.518-.82.518-1.31a1.125 1.125 0 0 0-.354-.848l-.048-.062c-.402-.516-.402-1.206 0-1.722l.048-.063c.303-.396.408.92.308-1.425a1.125 1.125 0 0 1-.247-.654l-.06-.086c-.4-.566-.414-1.316-.027-1.884l.055.08c.34.496.885.78 1.442.78h.287c.334 0 .65-.148.864-.405l.89-1.068c.369-.442 1.01-.535 1.49-.216l.766.51a2.25 2.25 0 0 0 1.161-.886l.048-.143c.326-.976-.191-2.056-1.182-2.476l-.244-.102a1.125 1.125 0 0 1-.664-.57l-.048-.143a1.125 1.125 0 0 0-1.664-.57l-.102.244c-.42.99-.47 2.118-.134 3.069l-.076.233a1.125 1.125 0 0 1-.928 1.652l-1.059-.423z" />
             </svg>
            <span>الاتجاهات</span>
          </button>
      )}
    </div>
  );
};

export default Map;
