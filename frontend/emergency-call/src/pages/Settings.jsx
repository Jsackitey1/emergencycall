import {
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Textarea,
  Button,
  useToast,
  Box,
  Text,
  Divider,
} from '@chakra-ui/react';
import { useInstallPWA } from '../hooks/useInstallPWA';
import { useEmergency } from '../context/EmergencyContext';
import { FaDownload } from 'react-icons/fa';

const Settings = () => {
  const { settings, updateSettings } = useEmergency();
  const [supportsPWA, handleInstallClick] = useInstallPWA();
  const toast = useToast();

  const handleSettingChange = (setting) => {
    updateSettings({
      [setting]: !settings[setting]
    });
  };

  const handleMessageChange = (e) => {
    updateSettings({
      emergencyMessage: e.target.value
    });
  };

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Settings</Heading>

        {supportsPWA && (
          <Box>
            <Button
              leftIcon={<FaDownload />}
              colorScheme="purple"
              onClick={handleInstallClick}
              width="full"
            >
              Install App
            </Button>
          </Box>
        )}

        <Box>
          <Text fontSize="xl" mb={4}>Notifications</Text>
          <VStack spacing={4} align="stretch">
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                SMS Alerts
              </FormLabel>
              <Switch
                isChecked={settings.smsAlerts}
                onChange={() => handleSettingChange('smsAlerts')}
                colorScheme="blue"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Push Notifications
              </FormLabel>
              <Switch
                isChecked={settings.pushNotifications}
                onChange={() => handleSettingChange('pushNotifications')}
                colorScheme="blue"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Location Sharing
              </FormLabel>
              <Switch
                isChecked={settings.locationSharing}
                onChange={() => handleSettingChange('locationSharing')}
                colorScheme="blue"
              />
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Text fontSize="xl" mb={4}>Emergency Message</Text>
          <FormControl>
            <FormLabel>Default Emergency Message</FormLabel>
            <Textarea
              value={settings.emergencyMessage}
              onChange={handleMessageChange}
              placeholder="Enter your default emergency message"
              rows={4}
            />
          </FormControl>
        </Box>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </VStack>
    </Container>
  );
};

export default Settings; 