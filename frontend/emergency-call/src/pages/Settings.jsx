import { useState } from 'react';
import { Container, VStack, Heading, Switch, FormControl, FormLabel, Textarea, Button, Box, Text, useToast } from '@chakra-ui/react';
import { useEmergency } from '../context/EmergencyContext';
import { forceRefresh } from '../utils/appUtils';

const Settings = () => {
  const { settings, updateSettings } = useEmergency();
  const [emergencyNumber, setEmergencyNumber] = useState(settings.emergencyNumber);
  const [emergencyMessage, setEmergencyMessage] = useState(settings.emergencyMessage);
  const [enableLocationSharing, setEnableLocationSharing] = useState(settings.enableLocationSharing);
  const toast = useToast();

  const handleSaveSettings = () => {
    updateSettings({
      emergencyNumber,
      emergencyMessage,
      enableLocationSharing,
    });
    toast({
      title: 'Settings Saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="md" py={8} width='500px' height='700px' justifyContent='center' alignItems='center'>
      <Heading mb={6}>Settings</Heading>
      <Box borderWidth={1} borderRadius="md" p={6} alignItems={'center'}>
        <VStack spacing={5} align='center' height="400px">
          <FormControl>
            <FormLabel>Emergency Number</FormLabel>
            <Textarea
              value={emergencyNumber}
              onChange={(e) => setEmergencyNumber(e.target.value)}
              placeholder="Enter emergency number"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Emergency Message</FormLabel>
            <Textarea
              value={emergencyMessage}
              onChange={(e) => setEmergencyMessage(e.target.value)}
              placeholder="Enter emergency message"
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Enable Location Sharing</FormLabel>
            <Switch
              isChecked={enableLocationSharing}
              onChange={(e) => setEnableLocationSharing(e.target.checked)}
            />
          </FormControl>
          <Button colorScheme="blue" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </VStack>
      </Box>

      <Box mt={8} p={4} borderWidth={1} borderRadius="md">
        <Heading size="md" mb={4}>Developer Options</Heading>
        <Button 
          colorScheme="red" 
          onClick={forceRefresh}
        >
          Force Refresh App
        </Button>
      </Box>
    </Container>
  );
};

export default Settings;
