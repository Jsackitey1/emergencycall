import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  HStack,
  Button,
  useToast
} from '@chakra-ui/react';
import { FaShareAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { useLocation } from '../hooks/useLocation';
import { isGoogleMapsLoaded, createMarkerIcon, calculateDistance, generateRandomNearbyLocation } from '../utils/mapUtils';
import { useEmergency } from '../context/EmergencyContext';

const MapView = () => {
  const { location, error } = useLocation();
  const { contacts, addHistoryEntry } = useEmergency();
  const toast = useToast();
  const [map, setMap] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const [userMarker, setUserMarker] = useState(null);
  const [contactMarkers, setContactMarkers] = useState([]);

  // Initialize the map when the component mounts
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (!isGoogleMapsLoaded()) {
      console.error('Google Maps API not loaded');
      setMapError('Google Maps API not loaded. Please refresh the page.');
      setLoading(false);
      return;
    }

    try {
      console.log('Initializing map with ref:', mapRef.current);
      const mapOptions = {
        center: location ? { lat: location.lat, lng: location.lng } : { lat: 39.6793, lng: -75.7508 },
        zoom: 14,
        mapTypeId: 'roadmap',
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setLoading(false);
      console.log('Map initialized successfully');
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError(`Error initializing map: ${err.message}`);
      setLoading(false);
    }
  }, [location, mapRef.current]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    if (contactMarkers.length > 0) {
      contactMarkers.forEach(marker => marker.setMap(null));
      setContactMarkers([]);
    }
  }, [contactMarkers]);

  // Update user location marker
  useEffect(() => {
    if (!map || !location) return;

    // Center map on user's location
    map.setCenter({ lat: location.lat, lng: location.lng });

    // Create or update user marker with a distinct icon
    if (userMarker) {
      userMarker.setPosition({ lat: location.lat, lng: location.lng });
    } else {
      const newUserMarker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        icon: createMarkerIcon('#4299E1', 10),
        title: 'Your Current Location'
      });
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: '<div><strong>Your Current Location</strong></div>'
      });
      
      newUserMarker.addListener('click', () => {
        infoWindow.open(map, newUserMarker);
      });
      
      setUserMarker(newUserMarker); 
    }
  }, [map, location, userMarker]);

  // Add nearby contact markers
  const showNearbyContacts = useCallback(() => {
    if (!map || !location || !contacts.length) return;
    
    // Clear existing contact markers
    clearMarkers();
    
    // Create markers for each contact with randomized nearby positions
    const newMarkers = contacts.map(contact => {
      // Generate a random position within 1-3 km of the user
      const distance = 0.5 + Math.random() * 2; // 0.5 to 2.5 km
      const angle = Math.random() * 2 * Math.PI; // Random angle in radians
      
      // Convert distance and angle to lat/lng offset (approximate)
      const lat = location.lat + (distance / 111) * Math.cos(angle);
      const lng = location.lng + (distance / 111) * Math.sin(angle) / Math.cos(location.lat * Math.PI/180);
      
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        icon: createMarkerIcon('#E53E3E', 8), // Red color for contacts
        title: contact.name
      });
      
      // Calculate actual distance
      const distanceKm = calculateDistance(location.lat, location.lng, lat, lng).toFixed(1);
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <strong>${contact.name}</strong><br>
            <span style="color: #718096;">${contact.phone}</span><br>
            <span style="color: #2D3748;">~${distanceKm} km away</span>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      
      return marker;
    });
    
    setContactMarkers(newMarkers);
    toast({
      title: `Showing ${contacts.length} nearby contacts`,
      status: 'info',
      duration: 2000,
    });
  }, [map, location, contacts, clearMarkers, toast]);

  // useEffect(() => {
  //   // Show contacts when map and location are ready
  //   if (map && location && contacts.length > 0) {
  //     showNearbyContacts();
  //   }
  // }, [map, location, contacts.length]);

  const shareLocation = async () => {
    if (!location) {
      toast({
        title: 'Location not available',
        description: 'Please enable location services and try again.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const shareData = {
        title: 'My Emergency Location',
        text: 'Here is my current location in case of emergency.',
        url: `https://www.google.com/maps?q=${location.lat},${location.lng}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
        addHistoryEntry({
          type: 'location_share',
          details: 'Location shared via device sharing'
        });
        toast({
          title: 'Location Shared',
          status: 'success',
          duration: 3000,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(shareData.url);
        addHistoryEntry({
          type: 'location_share',
          details: 'Location copied to clipboard'
        });
        toast({
          title: 'Location Copied',
          description: 'Location URL copied to clipboard',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={4} width = "auto">
      <Heading textAlign="center" mb={4}>Interactive Map</Heading>
      
      {error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          Location error: {error}
        </Alert>
      ) : (
        <Box position="relative" height="70vh"  borderRadius="md" overflow="hidden" mb={4}>
          {loading && (
            <Box 
              position="absolute" 
              top="0" 
              left="0" 
              right="0" 
              bottom="0" 
              bg="rgba(255,255,255,0.7)" 
              zIndex="1" 
              display="flex" 
              justifyContent="center" 
              alignItems="center"
            >
              <Spinner size="xl" color="blue.500" />
            </Box>
          )}
          
          {mapError && (
            <Alert status="error">
              <AlertIcon />
              {mapError}
            </Alert>
          )}
          
          <Box 
            ref={mapRef} 
            height="100%" 
            width="100%" 
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
          />
        </Box>
      )}

      {location && (
        <Box mb={4}>
          <Text fontSize="lg" fontWeight="bold" mb={2}>Your Current Location</Text>
          <HStack spacing={2} mb={4}>
            <Badge colorScheme="blue">Lat: {location.lat.toFixed(6)}</Badge>
            <Badge colorScheme="blue">Lng: {location.lng.toFixed(6)}</Badge>
          </HStack>
          
          <HStack spacing={4} display={contacts.length > 0 ? 'flex' : 'none'}>
            <Button 
              leftIcon={<FaShareAlt />} 
              colorScheme="blue" 
              onClick={shareLocation}
              isDisabled={!location}
            >
              Share Location
            </Button>
            <Button 
              leftIcon={<FaMapMarkerAlt />} 
              colorScheme="purple" 
              onClick={() => {
                if (map && location) {
                  map.setCenter({ lat: location.lat, lng: location.lng });
                  map.setZoom(16);
                }
              }}
              isDisabled={!location}
            >
              Center Map
            </Button>
            <Button 
              leftIcon={<FaUsers />} 
              colorScheme="teal" 
              onClick={showNearbyContacts}
              isDisabled={!location || contacts.length === 0}
              ml={2}
            >
              Show Contacts
              {contacts.length > 0 && <Badge ml={2} colorScheme="green">{contacts.length}</Badge>}
            </Button>
          </HStack>
        </Box>
      )}
    </Container>
  );
};

export default MapView;
