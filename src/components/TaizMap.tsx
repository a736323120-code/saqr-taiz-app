import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface TaizMapProps {
  captainCoords?: { lat: number; lng: number };
  customerDistrict?: string;
  storeTitle?: string;
  status?: string;
  height?: string;
}

export const TaizMap: React.FC<TaizMapProps> = ({
  captainCoords = { lat: 13.5790, lng: 44.0170 },
  customerDistrict = 'شارع جمال',
  storeTitle = 'مطعم الشيباني - تعز',
  status = 'on_the_way',
  height = '320px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const captainMarkerRef = useRef<L.Marker | null>(null);

  // Taiz landmarks
  const storePos = { lat: 13.5820, lng: 44.0180 };
  const customerPos = { lat: 13.5750, lng: 44.0110 };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map centered on Taiz City
      const map = L.map(mapContainerRef.current, {
        center: [13.5789, 44.0178],
        zoom: 14,
        zoomControl: true,
      });

      // CartoDB Dark or OpenStreetMap tiles for clean UI
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Store Marker Icon
      const storeIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: #0f172a; color: #f59e0b; border: 2px solid #f59e0b; padding: 4px 8px; border-radius: 12px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">🏪 ${storeTitle}</div>`,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });
      L.marker([storePos.lat, storePos.lng], { icon: storeIcon }).addTo(map);

      // Customer Marker Icon
      const customerIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: #10b981; color: #ffffff; border: 2px solid #059669; padding: 4px 8px; border-radius: 12px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">📍 موقعك (${customerDistrict})</div>`,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });
      L.marker([customerPos.lat, customerPos.lng], { icon: customerIcon }).addTo(map);

      // Route Line between Store, Captain, and Customer in Taiz
      const polyline = L.polyline([
        [storePos.lat, storePos.lng],
        [captainCoords.lat, captainCoords.lng],
        [customerPos.lat, customerPos.lng],
      ], {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(map);

      // Captain Moving Marker Icon
      const captainIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: #f59e0b; color: #0f172a; border: 3px solid #ffffff; padding: 5px 10px; border-radius: 16px; font-weight: 900; font-size: 11px; white-space: nowrap; box-shadow: 0 6px 16px rgba(245,158,11,0.5); display: flex; items-center; gap: 4px;">🛵 الكابتن في الطريق</div>`,
        iconSize: [110, 32],
        iconAnchor: [55, 16],
      });

      const captainMarker = L.marker([captainCoords.lat, captainCoords.lng], { icon: captainIcon }).addTo(map);
      captainMarkerRef.current = captainMarker;

      mapInstanceRef.current = map;

      // Invalidate map size after small delay for container render compatibility
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);
    } else {
      // Update captain position
      if (captainMarkerRef.current) {
        captainMarkerRef.current.setLatLng([captainCoords.lat, captainCoords.lng]);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [captainCoords.lat, captainCoords.lng, customerDistrict, storeTitle]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Badge Overlay */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-950/90 text-amber-400 backdrop-blur px-3 py-1 rounded-xl text-xs font-bold border border-amber-500/30 shadow-md">
        🗺️ خريطة تعز المباشرة - تتبع المندوب
      </div>
    </div>
  );
};
