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
import { useLocation } from '../hooks/useLocation';
import { useEmergency } from '../context/EmergencyContext';

const Dashboard = () => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [sosTimer, setSosTimer] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const { location } = useLocation();
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

  const cancelSOS = useCallback(() => {
    if (sosTimer) {
      clearInterval(sosTimer);
      setSosTimer(null);
    }
    setIsSOSActive(false);   
    setCountdown(5);
    
    toast({
      title: 'SOS Cancelled',
      description: 'Emergency sequence has been cancelled',
      status: 'info',
      duration: 3000,
    });
  }, [sosTimer, toast]);

  const handleSOS = useCallback(() => {
    // If SOS is already active, cancel it
    if (isSOSActive) {
      cancelSOS();
      return;
    }
    
    if (!contacts.length) {
      onOpen();
      return;
    }
    
    setIsSOSActive(true);
    let count = 5;
    setCountdown(count);
    
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        handleEmergencyCall();
        shareLocation();
        sendAlert();
        cancelSOS();
        clearInterval(timer);
      }
    }, 1000);

    setSosTimer(timer);
  }, [contacts.length, isSOSActive, cancelSOS, handleEmergencyCall, shareLocation, sendAlert]);
  
  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (sosTimer) clearInterval(sosTimer);
    };
  }, [sosTimer]);

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
    <Container maxW="container.md" py={8} centerContent>
      <VStack spacing={8} align="center" width="100%" height="630px" justifyContent="center" >
        <Heading textAlign="center" mb={8} height='300px' >EmergencyConnect</Heading>
        
        <Box textAlign="center" width="100%" height="100%" >
          <Button
            size="lg"
            height="300px"
            width="300px"
            borderRadius="full"
            colorScheme={isSOSActive ? 'red' : 'blue'}
            onClick={handleSOS}
            _hover={{ transform: 'scale(1.05)' }}
            transition="all 0.2s"
            mx="auto"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
            fontWeight="bold"
          > 
            {isSOSActive ? `Cancel (${countdown})` : 'SOS'}
          </Button>
        </Box>

        <Grid 
          templateColumns="repeat(2, 1fr)" 
          gap={4} 
          mt={8}
          width="100%"
          maxW="500px"
          mx="auto"
        >
          <Button
            leftIcon={<FaPhone />}
            colorScheme="green"
            onClick={handleEmergencyCall}
            size="lg"
            width="100%"
          >
            Emergency Call
          </Button>
          <Button
            leftIcon={<FaMapMarkerAlt />}
            colorScheme="purple"
            onClick={() => navigate('/location')}
            size="lg"
            width="100%"
          >
            Location Map
          </Button>
          <Button
            leftIcon={<FaBell />}
            colorScheme="orange"
            onClick={sendAlert}
            size="lg"
            width="100%"
          >
            Send Alert
          </Button>
          <Button
            leftIcon={<FaHistory />}
            colorScheme="teal"
            onClick={() => navigate('/history')}
            size="lg"
            width="100%"
          >
            View History
          </Button>
        </Grid>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader textAlign="center">No Emergency Contacts</ModalHeader>
          <ModalBody>
            <Text textAlign="center">
              Please add emergency contacts before using the SOS feature.
              This ensures we can notify your trusted contacts in case of emergency.
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
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
