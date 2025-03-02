import { useState, useEffect } from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';

const UpdateNotification = () => {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // This fires when the service worker controlling this page changes
        console.log('Service worker controller changed');
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'VERSION') {
          console.log('Service worker version:', event.data.version);
          // Show update notification if version changes
          setShowUpdateNotification(true);
        }
      });

      // Check for updates periodically
      const checkForUpdates = () => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CHECK_VERSION' });
        }
      };

      // Check for updates on load and every 5 minutes
      checkForUpdates();
      const interval = setInterval(checkForUpdates, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Send skip waiting message to service worker
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        toast({
          title: "Updating application",
          description: "The page will reload to apply updates",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  };

  if (!showUpdateNotification) return null;

  return (
    <Box
      position="fixed"
      bottom="80px"
      left="0"
      right="0"
      zIndex="1000"
      p={4}
      bg="blue.500"
      color="white"
      textAlign="center"
    >
      <Text mb={2}>A new version is available!</Text>
      <Button colorScheme="white" variant="outline" onClick={handleUpdate}>
        Update Now
      </Button>
    </Box>
  );
};

export default UpdateNotification;
