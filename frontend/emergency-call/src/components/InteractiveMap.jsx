import { useEffect, useRef, useState } from 'react';
import { Box, Spinner, Text, Center } from '@chakra-ui/react';
import { useLocation } from '../hooks/useLocation'; 
import { isGoogleMapsLoaded, createMarkerIcon } from '../utils/mapUtils';

const InteractiveMap = ({ height }) => {
  const { location, error } = useLocation();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isUpdatingMarker, setIsUpdatingMarker] = useState(false);
  const mapRef = useRef(null); 

  // Wait for Google Maps to be fully loaded
  useEffect(() => {
    const checkGoogleMaps = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        clearInterval(checkGoogleMaps);
        // Initialize map when component mounts
        if (!isGoogleMapsLoaded()) {
          console.error('Google Maps API not loaded');
          return;
        }
        console.log('Initializing map with ref:', mapRef.current);

        const newMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: location.lat, lng: location.lng },
          zoom: 15,
          mapTypeId: 'roadmap',
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'greedy',
        });
        setMap(newMap);

        return () => {
          if (map) {
            window.google.maps.event.clearInstanceListeners(map);
          }
        };
      }
    }, 100);
  }, []);

  // Update marker position when location changes
  useEffect(() => {
    if (!map || !location) return;

    // Prevent rapid marker updates
    if (isUpdatingMarker) return;
    setIsUpdatingMarker(true);

    // Use a timeout to debounce marker updates
    const updateTimeout = setTimeout(() => {
      if (marker) {
        // Update existing marker position
        marker.setPosition({ lat: location.lat, lng: location.lng });
      } else {
        // Create new marker
        const newMarker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          icon: createMarkerIcon('#E53E3E', 10),
          title: 'Your Location'
        });
        setMarker(newMarker);
      }
      setIsUpdatingMarker(false);
    }, 200); // 200ms debounce

    return () => clearTimeout(updateTimeout);
  }, [map, location, marker]);

  return (
    <Box height={height}>
      {!map && !error && (
        <Center height="100%">
          <Spinner size="xl" color="blue.500" />
        </Center>
      )}
      {error && (
        <Center height="100%">
          <Text color="red.500">Error: {error}</Text>
        </Center>
      )}
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </Box>
  );
};

export default InteractiveMap;
