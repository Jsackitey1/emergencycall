import { useState, useEffect, useRef } from 'react';

export const useLocation = () => {
  // Default to University of Delaware coordinates
  const [location, setLocation] = useState({ lat: 39.6793, lng: -75.7508 });
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(false);
  const watchIdRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    console.log('Initializing location tracking at University of Delaware');
    
    let watchId = null;
    // For debugging - set a mock location if geolocation is not available
    const setMockLocation = () => {
      console.log('Setting mock location');
      setLocation({
        lat: 39.6793, lng: -75.7508 // University of Delaware coordinates
      });
      setWatching(true);
    };

    const handleLocationError = (error) => {
      console.error('Geolocation error:', error);
      setError(error.message);
      
      // Schedule a retry after 5 seconds
      retryTimeoutRef.current = setTimeout(() => {
        getInitialPosition();
      }, 5000);
    };

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Using default location.');
      setMockLocation();
      return;
    } else {
      console.log('Geolocation is supported by your browser');
    }

    // Get initial position with better error handling
    const getInitialPosition = () => {
      console.log('Getting initial position');
      setError(null); // Clear previous errors when retrying
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Initial position received:', position);
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('Got location:', newLocation);
          setLocation(newLocation);
          setWatching(true);
        },
        handleLocationError, 
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    };

    // Watch position for real-time updates
    // Add debounce for location updates to prevent the marker from jumping around
    let lastUpdateTime = 0;
    const LOCATION_UPDATE_THRESHOLD = 1000; // 1 second minimum between updates
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        if (now - lastUpdateTime > LOCATION_UPDATE_THRESHOLD) {
          console.log('Watch position update:', position.coords);
          setWatching(true);
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          lastUpdateTime = now;
        }
      },
      handleLocationError,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    getInitialPosition();

    // Cleanup function to stop watching location
    return () => {
      if (watchIdRef.current) {
        console.log('Clearing location watch');
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
    
  }, []);

  return { location, error, watching };
};
