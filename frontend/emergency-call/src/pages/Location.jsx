import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FaShareAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';

const Location = () => {
  const [userLocation, setUserLocation] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          toast({
            title: 'Location Error',
            description: error.message,
            status: 'error',
            duration: null,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  const shareLocation = async () => {
    if (!userLocation) return;

    const googleMapsUrl = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Location',
          text: 'Here is my current location',
          url: googleMapsUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(googleMapsUrl);
      toast({
        title: 'Location Copied',
        description: 'Location link copied to clipboard',
        status: 'success',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8} centerContent>
      <VStack spacing={8} align="center" width="100%">
        <Heading>Your Location</Heading>

        {userLocation ? (
          <>
            <MapComponent
              center={userLocation}
              zoom={16}
              style={{ height: '60vh' }}
            />
            <Button
              leftIcon={<FaShareAlt />}
              colorScheme="blue"
              onClick={shareLocation}
              width="100%"
              maxW="400px"
            >
              Share Location
            </Button>
          </>
        ) : (
          <Text>Getting your location...</Text>
        )}
      </VStack>
    </Container>
  );
};

export default Location; 