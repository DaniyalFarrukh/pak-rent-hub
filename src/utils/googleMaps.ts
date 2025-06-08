
import { Loader } from '@googlemaps/js-api-loader';

// Note: In production, store this API key in Supabase secrets
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

let googleMapsLoader: Loader | null = null;

export const initializeGoogleMaps = async () => {
  if (!googleMapsLoader) {
    googleMapsLoader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }
  
  return await googleMapsLoader.load();
};

export const createAutocomplete = (
  inputElement: HTMLInputElement,
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void,
  options?: google.maps.places.AutocompleteOptions
) => {
  const defaultOptions: google.maps.places.AutocompleteOptions = {
    types: ['(cities)'],
    componentRestrictions: { country: 'pk' }, // Pakistan
    ...options
  };

  const autocomplete = new google.maps.places.Autocomplete(inputElement, defaultOptions);
  
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    onPlaceSelected(place);
  });

  return autocomplete;
};

export const createMap = (
  container: HTMLElement,
  center: google.maps.LatLngLiteral,
  zoom: number = 10
) => {
  return new google.maps.Map(container, {
    center,
    zoom,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });
};

export const createMarker = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  title?: string
) => {
  return new google.maps.Marker({
    position,
    map,
    title,
  });
};
