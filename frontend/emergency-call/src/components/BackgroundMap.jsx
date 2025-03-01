import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

const BackgroundMap = () => {
  useEffect(() => {
    const initMap = () => {
      console.log('Initializing map...');
      const mapElement = document.getElementById('map');
      console.log('Map element:', mapElement);
      console.log('Google Maps loaded:', !!window.google);

      if (!mapElement || !window.google) {
        console.log('Map element or Google Maps not available');
        return;
      }

      const map = new window.google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        disableDefaultUI: true,
        zoomControl: true
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map.setCenter(pos);
            new window.google.maps.Marker({
              position: pos,
              map: map
            });
          }
        );
      }
    };

    // Try to initialize map immediately
    initMap();

    // If Google Maps isn't loaded yet, wait for it
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDGsTxaviBiGwRE2YKV7xxkoOHA8eUPy5k`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <Box
      id="map"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1
      }}
    />
  );
};

export default BackgroundMap; 