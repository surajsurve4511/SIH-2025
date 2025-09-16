import { useState, useEffect } from 'react';

const SCRIPT_ID = 'google-maps-script';
const CALLBACK_NAME = 'googleMapsApiLoaded';
const AUTH_FAILURE_CALLBACK_NAME = 'googleMapsAuthFailure';

let isLoaded = false;
let isLoading = false;
const listeners: ((error?: Error) => void)[] = [];

// This function is called by the Google Maps script when it has loaded.
(window as any)[CALLBACK_NAME] = () => {
  isLoaded = true;
  isLoading = false;
  listeners.forEach(cb => cb());
  listeners.length = 0; // Clear listeners after calling them
};

// This function will be called by Google Maps if auth fails (e.g., Invalid Key)
(window as any)[AUTH_FAILURE_CALLBACK_NAME] = () => {
    const err = new Error("Google Maps API Key is invalid or misconfigured. Please check your API key, billing status, and API restrictions in the Google Cloud Console.");
    console.error("Google Maps Authentication Error. See https://developers.google.com/maps/documentation/javascript/error-messages#invalid-key-map-error");
    listeners.forEach(l => l(err));
    listeners.length = 0;
    isLoading = false;
};

const useGoogleMaps = () => {
  const [loaded, setLoaded] = useState(isLoaded);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (isLoaded) {
      setLoaded(true);
      return;
    }

    // Add a listener that will be called when the script loads
    const cb = (err?: Error) => {
      if (err) {
        setError(err);
      } else {
        setLoaded(true);
      }
    };
    listeners.push(cb);

    // If the script is already in the document, don't add it again.
    if (document.getElementById(SCRIPT_ID)) {
      return;
    }

    // If not currently loading, start loading
    if (!isLoading) {
      isLoading = true;
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        const err = new Error("The application could not find the required API_KEY. This single key is used for both Google AI and Google Maps services.");
        console.error(err.message);
        listeners.forEach(l => l(err));
        listeners.length = 0;
        isLoading = false;
        return;
      }
      
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry&callback=${CALLBACK_NAME}&auth_error_callback=${AUTH_FAILURE_CALLBACK_NAME}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        const err = new Error("Failed to load Google Maps script. This could be a network issue.");
        listeners.forEach(l => l(err));
        listeners.length = 0;
        isLoading = false;
      };
      document.head.appendChild(script);
    }
    
    // Cleanup: remove listener if component unmounts before script loads
    return () => {
      const index = listeners.indexOf(cb);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return { isMapApiLoaded: loaded, mapApiError: error };
};

export default useGoogleMaps;