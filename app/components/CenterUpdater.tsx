"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { LatLngTuple } from "leaflet";

/**
 * Interface for CenterUpdater component props
 * 
 * @interface CenterUpdaterProps
 * @property {LatLngTuple} center - Geographical coordinates [latitude, longitude] to center the map on
 */
interface CenterUpdaterProps {
  center: LatLngTuple;
}

/**
 * CenterUpdater Component
 * 
 * A utility component for Leaflet maps that updates the map center when coordinates change.
 * This component is used with react-leaflet to create a smooth animation when the map
 * needs to be recentered due to user interaction or data changes.
 * 
 * Key features:
 * - Uses Leaflet's flyTo method for smooth animations
 * - Automatically detects center coordinate changes
 * - Renders nothing in the DOM (utility-only component)
 * - Maintains map zoom level during center updates
 * 
 * Used within Map components when the center coordinates are controlled
 * by external state or props.
 * 
 * @component
 * @param {CenterUpdaterProps} props - Component props
 * @returns {null} Does not render any visible elements
 */
const CenterUpdater: React.FC<CenterUpdaterProps> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

export default CenterUpdater;
