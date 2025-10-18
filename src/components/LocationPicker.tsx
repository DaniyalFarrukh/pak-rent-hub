import React, { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { initializeGoogleMaps, createMap, createMarker } from '@/utils/googleMaps';
import { Loader2 } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: string, lat: number, lng: number) => void;
  defaultLocation?: string;
  defaultLat?: number | null;
  defaultLng?: number | null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  defaultLocation = '',
  defaultLat = null,
  defaultLng = null
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(defaultLocation);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        await initializeGoogleMaps();
        
        if (mapRef.current) {
          const center = defaultLat && defaultLng 
            ? { lat: defaultLat, lng: defaultLng }
            : { lat: 31.5204, lng: 74.3587 }; // Lahore, Pakistan
          
          const newMap = createMap(mapRef.current, center, 12) as any;
          setMap(newMap);

          const newMarker = createMarker(newMap, center, 'Selected Location') as any;
          setMarker(newMarker);

          // Allow user to click on map to set location
          newMap.addListener('click', async (e: any) => {
            if (e.latLng) {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              
              newMarker.setPosition(e.latLng);
              
              // Reverse geocode to get location name
              const geocoder = new (google.maps as any).Geocoder();
              const result = await geocoder.geocode({ location: e.latLng });
              
              if (result.results[0]) {
                const address = result.results[0].formatted_address;
                setLocation(address);
                onLocationSelect(address, lat, lng);
              }
            }
          });

          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
      }
    };

    initMap();
  }, []);

  const handleLocationChange = async (value: string) => {
    setLocation(value);
    
    if (value.length > 3 && map && marker) {
      try {
        const geocoder = new (google.maps as any).Geocoder();
        const result = await geocoder.geocode({ address: value });
        
        if (result.results[0]) {
          const location = result.results[0].geometry.location;
          map.setCenter(location);
          marker.setPosition(location);
          onLocationSelect(value, location.lat(), location.lng());
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="location">Location</Label>
      <Input
        id="location"
        value={location}
        onChange={(e) => handleLocationChange(e.target.value)}
        placeholder="Enter location or click on map"
        required
      />
      <div className="relative h-64 rounded-lg overflow-hidden border">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>
      <p className="text-sm text-muted-foreground">
        Click on the map to set the exact location
      </p>
    </div>
  );
};