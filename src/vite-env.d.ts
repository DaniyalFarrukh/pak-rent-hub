
/// <reference types="vite/client" />

declare global {
  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions);
      }

      interface MapOptions {
        center?: LatLngLiteral;
        zoom?: number;
        mapTypeControl?: boolean;
        streetViewControl?: boolean;
        fullscreenControl?: boolean;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      class Marker {
        constructor(opts?: MarkerOptions);
        addListener(eventName: string, handler: () => void): void;
        setMap(map: Map | null): void;
      }

      interface MarkerOptions {
        position?: LatLngLiteral;
        map?: Map;
        title?: string;
      }

      class InfoWindow {
        constructor(opts?: InfoWindowOptions);
        open(map?: Map, anchor?: Marker): void;
        close(): void;
        setContent(content: string | Element): void;
      }

      interface InfoWindowOptions {
        content?: string | Element;
        position?: LatLngLiteral;
      }

      namespace places {
        class Autocomplete {
          constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
          addListener(eventName: string, handler: () => void): void;
          getPlace(): PlaceResult;
        }

        interface AutocompleteOptions {
          types?: string[];
          componentRestrictions?: ComponentRestrictions;
        }

        interface ComponentRestrictions {
          country?: string | string[];
        }

        interface PlaceResult {
          formatted_address?: string;
          geometry?: {
            location?: {
              lat(): number;
              lng(): number;
            };
          };
        }
      }

      namespace event {
        function clearInstanceListeners(instance: any): void;
      }
    }
  }
}

export {};
