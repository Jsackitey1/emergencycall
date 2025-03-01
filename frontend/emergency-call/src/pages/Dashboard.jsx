import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  VStack,
  Button,
  Text,
  useToast,
  Container,
  Grid,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { FaPhone, FaMapMarkerAlt, FaBell, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../context/EmergencyContext';

const Dashboard = () => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const { contacts, settings, addHistoryEntry } = useEmergency();

  const handleEmergencyCall = () => {
    window.location.href = 'tel:911';
    addHistoryEntry({
      type: 'emergency_call',
      details: 'Emergency call placed to 911'
    });
  };

  const shareLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      
      if (settings.locationSharing && contacts.length > 0) {
        // In a real app, this would send to your backend
        contacts.forEach(contact => {
          console.log(`Sending location to ${contact.name}: ${googleMapsUrl}`);
        });
      }
      
      addHistoryEntry({
        type: 'location_share',
        details: 'Location shared with emergency contacts'
      });

      toast({
        title: 'Location Shared',
        description: `Your location has been shared with ${contacts.length} contacts`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Unable to share location: ${error.message}`,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const sendAlert = () => {
    if (contacts.length === 0) {
      toast({
        title: 'No Contacts',
        description: 'Please add emergency contacts first',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // In a real app, this would send SMS via your backend
    contacts.forEach(contact => {
      console.log(`Sending SMS to ${contact.name}: ${settings.emergencyMessage}`);
    });

    addHistoryEntry({
      type: 'alert_sent',
      details: 'Emergency alert sent to all contacts'
    });

    toast({
      title: 'Alert Sent',
      description: `Emergency message sent to ${contacts.length} contacts`,
      status: 'success',
      duration: 3000,
    });
  };

  const handleSOS = useCallback(() => {
    if (!contacts.length) {
      onOpen();
      return;
    }

    setIsSOSActive(true);
    let count = 5;

    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count === 0) {
        clearInterval(timer);
        setIsSOSActive(false);
        // Trigger emergency actions
        handleEmergencyCall();
        shareLocation();
        sendAlert();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [contacts.length]);

  useEffect(() => {
    // Request necessary permissions
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
          if (result.state === 'denied') {
            toast({
              title: 'Location Access Required',
              description: 'Please enable location access for emergency features',
              status: 'warning',
              duration: null,
            });
          }
        });
    }
  }, []);

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center" mb={8}>EmergencyConnect</Heading>
        
        <Box textAlign="center">
          <Button
            size="lg"
            height="200px"
            width="200px"
            borderRadius="full"
            colorScheme={isSOSActive ? 'red' : 'blue'}
            onClick={handleSOS}
            _hover={{ transform: 'scale(1.05)' }}
            transition="all 0.2s"
          >
            {isSOSActive ? `Cancel (${countdown})` : 'SOS'}
          </Button>
        </Box>

        <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={8}>
          <Button
            leftIcon={<FaPhone />}
            colorScheme="green"
            onClick={handleEmergencyCall}
            size="lg"
          >
            Emergency Call
          </Button>
          <Button
            leftIcon={<FaMapMarkerAlt />}
            colorScheme="purple"
            onClick={shareLocation}
            size="lg"
          >
            Share Location
          </Button>
          <Button
            leftIcon={<FaBell />}
            colorScheme="orange"
            onClick={sendAlert}
            size="lg"
          >
            Send Alert
          </Button>
          <Button
            leftIcon={<FaHistory />}
            colorScheme="teal"
            onClick={() => navigate('/history')}
            size="lg"
          >
            View History
          </Button>
        </Grid>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>No Emergency Contacts</ModalHeader>
          <ModalBody>
            <Text>
              Please add emergency contacts before using the SOS feature.
              This ensures we can notify your trusted contacts in case of emergency.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => navigate('/contacts')}>
              Add Contacts
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Dashboard;