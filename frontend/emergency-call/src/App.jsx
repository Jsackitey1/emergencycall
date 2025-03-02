import { ChakraProvider, CSSReset, Box, Center, Spinner, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import History from './pages/History';
// import UpdateNotification from './components/UpdateNotification';
import Location from './pages/Location';
import MapView from './pages/MapView';
import Navigation from './components/Navigation';
import { EmergencyProvider } from './context/EmergencyContext';
import { useEffect, useState } from 'react';

function App() {
  const APP_VERSION = '1.0.1'; // Add version tracking
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(null);

  useEffect(() => {
    // Check if Google Maps API is already loaded to prevent duplicate loading
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!googleMapsApiKey || googleMapsApiKey === 'undefined') {
      console.error('Google Maps API key is missing. Please add it to your .env file.');
      setMapsError('Google Maps API key is missing');
      return;
    }

    // If Google Maps is already loaded, don't load it again
    if (window.google && window.google.maps) {
      console.log('Google Maps API already loaded');
      setMapsLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      setMapsLoaded(true);
    };
    script.onerror = (error) => {
      console.error('Error loading Google Maps API:', error);
      setMapsError('Failed to load Google Maps API');
    };
    
    // Define the callback function
    window.initMap = function() {
      console.log('Google Maps initialized via callback');
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    console.log(`App version: ${APP_VERSION}`);
  }, []);

  return (
    <ChakraProvider>
      <CSSReset />
      <EmergencyProvider>        
        <Router>          
          {mapsError && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {mapsError}
            </Alert>
          )}
          
          {!mapsLoaded && !mapsError ? (
            <Center p={8} height="100vh">
              <Spinner size="xl" color="blue.500" mr={4} /> 
              <Text>Loading Google Maps...</Text>
            </Center>
          ) : (
            <Box 
              display={mapsLoaded || mapsError ? "flex" : "none"}
              className="content-wrapper" 
              mx="auto"
              my={4} 
              p={4} 
              flex="1" 
              pb="80px" 
              width="100%"
              maxW="container.md"
              // display="flex"
              flexDirection="column"
              alignItems="center"
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(10px)"
              borderRadius="lg"
              boxShadow="lg"
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/location" element={<Location />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </Box>
          )}
          <Navigation />
          {/* <UpdateNotification /> */}
        </Router>
      </EmergencyProvider>
    </ChakraProvider>
  );
}

export default App;
