
import { useEffect, useRef, useState } from 'react';
import { initializeGoogleMaps, createMap, createMarker } from '@/utils/googleMaps';

interface MapDisplayProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>;
  className?: string;
  height?: string;
}

export const MapDisplay = ({
  center = { lat: 31.5204, lng: 74.3587 }, // Default to Lahore
  zoom = 10,
  markers = [],
  className = "",
  height = "400px"
}: MapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        setIsLoading(true);
        setError(null);
        
        await initializeGoogleMaps();
        
        mapInstanceRef.current = createMap(mapRef.current, center, zoom);
        
        // Add markers
        markers.forEach(marker => {
          if (mapInstanceRef.current) {
            const mapMarker = createMarker(
              mapInstanceRef.current,
              marker.position,
              marker.title
            );
            
            if (marker.info && typeof google !== 'undefined') {
              const infoWindow = new google.maps.InfoWindow({
                content: marker.info
              });
              
              mapMarker.addListener('click', () => {
                if (mapInstanceRef.current) {
                  infoWindow.open(mapInstanceRef.current, mapMarker);
                }
              });
            }
            
            markersRef.current.push(mapMarker);
          }
        });
        
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [center.lat, center.lng, zoom, markers]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg`} style={{ height }}>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg" style={{ height }}>
          <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full rounded-lg"
        style={{ height, display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};
