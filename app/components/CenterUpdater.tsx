'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface CenterUpdaterProps {
    center: LatLngTuple;
}

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
