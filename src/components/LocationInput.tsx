
import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initializeGoogleMaps, createAutocomplete } from '@/utils/googleMaps';

interface LocationInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string, placeData?: google.maps.places.PlaceResult) => void;
  className?: string;
  required?: boolean;
}

export const LocationInput = ({
  label = "Location",
  placeholder = "e.g., Lahore, Punjab",
  value,
  onChange,
  className = "",
  required = false
}: LocationInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      if (!inputRef.current) return;

      try {
        setIsLoading(true);
        setError(null);
        
        await initializeGoogleMaps();
        
        autocompleteRef.current = createAutocomplete(
          inputRef.current,
          (place) => {
            if (place.formatted_address) {
              onChange(place.formatted_address, place);
            }
          },
          {
            types: ['(cities)'],
            componentRestrictions: { country: 'pk' }
          }
        );
      } catch (err) {
        console.error('Failed to initialize Google Maps:', err);
        setError('Failed to load location services');
      } finally {
        setIsLoading(false);
      }
    };

    initAutocomplete();

    return () => {
      if (autocompleteRef.current && typeof google !== 'undefined') {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          {label} {required && '*'}
        </Label>
      )}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <Input
          ref={inputRef}
          id="location"
          placeholder={isLoading ? "Loading location services..." : placeholder}
          value={value}
          onChange={handleInputChange}
          disabled={isLoading}
          className="pl-10 h-14 text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-xl shadow-sm"
        />
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};
