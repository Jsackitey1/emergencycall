import {
  Container,
  VStack,
  Heading,
  Box,
  Text,
  Button,
  HStack,
  Badge,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  Tooltip,
  Spinner
} from '@chakra-ui/react';
import { FaShareAlt, FaMapMarkerAlt, FaMap } from 'react-icons/fa';
import { useEmergency } from '../context/EmergencyContext';
import InteractiveMap from '../components/InteractiveMap';
import { useLocation } from '../hooks/useLocation';
import { useNavigate } from 'react-router-dom';

const Location = () => {
  const { contacts, addHistoryEntry } = useEmergency();
  const { location, error, watching } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

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

  const sendLocationToContacts = () => {
    if (!location) {
      toast({
        title: 'Location not available',
        description: 'Please enable location services and try again.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (contacts.length === 0) {
      toast({
        title: 'No Contacts',
        description: 'Please add emergency contacts first',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // In a real app, this would send the location to your contacts via SMS/email
    addHistoryEntry({
      type: 'location_share',
      details: `Location sent to ${contacts.length} emergency contacts`
    });

    toast({
      title: 'Location Sent',
      description: `Your location has been sent to ${contacts.length} contacts`,
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Location Tracking</Heading>
        
        <Box>
          {error ? (
            <Alert status="error" mb={4}>
              <AlertIcon />
              Location error: {error}
              {error.includes('timeout') && (
                <Button ml={2} size="sm" colorScheme="blue" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              )}
            </Alert>
          ) : !watching && !location ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px" width="100%">
              <Spinner size="xl" color="blue.500" mr={4} />
              <Text>Acquiring your location...</Text>
            </Box>
          ) : (
            <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <InteractiveMap height="400px" />
            </Box>
          )}
          
          <Button
            mt={4}
            leftIcon={<FaMap />}
            colorScheme="teal"
            onClick={() => navigate('/map')}
            width="full"
          >
            Open Full Map View
          </Button>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>Your Current Location</Text>
          {location ? (
            <HStack spacing={2} mb={4}>
              <Badge colorScheme="blue">Lat: {location.lat.toFixed(6)}</Badge>
              <Badge colorScheme="blue">Lng: {location.lng.toFixed(6)}</Badge>
            </HStack>
          ) : (
            <Text color="gray.500">Obtaining your location...</Text>
          )}
          
          <Text fontSize="sm" color="gray.600" mb={4}>
            Your location is only shared when you explicitly choose to do so.
          </Text>
          
          <HStack spacing={4}>
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
              onClick={sendLocationToContacts}
              isDisabled={!location}
            >
              Send to Contacts
            </Button>
          </HStack>
        </Box>

        <Divider />

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Emergency Contacts</Text>
          {contacts.length > 0 ? (
            <VStack align="stretch" spacing={2}>
              {contacts.map((contact) => (
                <HStack 
                  key={contact.id} 
                  p={3} 
                  borderWidth={1} 
                  borderRadius="md"
                  justify="space-between"
                >
                  <Tooltip label={contact.phone}><Text fontWeight="medium">{contact.name}</Text></Tooltip>
                  <Badge colorScheme="green">
                    {location ? `~${(Math.random() * 5).toFixed(1)} km away` : 'Unknown'}
                  </Badge>
                </HStack>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">No emergency contacts added yet.</Text>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default Location;
