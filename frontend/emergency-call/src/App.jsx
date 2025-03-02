import { ChakraProvider, CSSReset, Box, Center, Spinner, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import Location from './pages/Location';
import MapView from './pages/MapView';
import History from './pages/History';
import Navigation from './components/Navigation';
import { EmergencyProvider } from './context/EmergencyContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import { useEffect, useState } from 'react';

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <AuthProvider>
        <EmergencyProvider>
          <Router>
            <AppContent />
          </Router>
        </EmergencyProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

function AppContent() {
  const { currentUser, loading } = useAuth();
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey || googleMapsApiKey === 'undefined') {
      setMapsError('Google Maps API key is missing');
      return;
    }

    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    script.onerror = () => setMapsError('Failed to load Google Maps API');
    
    window.initMap = () => console.log('Maps initialized');
    document.head.appendChild(script);
  }, [currentUser]);

  console.log('Auth state:', { currentUser, loading }); // Debug log

  if (loading) {
    return (
      <Center p={8} height="100vh">
        <Spinner size="xl" color="blue.500" mr={4} />
        <Text>Loading authentication...</Text>
      </Center>
    );
  }

  // Not authenticated - show login or signup
  if (!currentUser) {
    console.log('User not authenticated, showing login/signup'); // Debug log
    return (
      <Box minH="100vh">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    );
  }

  // User is authenticated - show protected content
  console.log('User authenticated, showing dashboard'); // Debug log
  return (
    <>
    <Box minH="100vh" bg="gray.50">
      <Routes>
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route path="/" element={
          <Box
            className="content-wrapper"
            mx="auto"
            my={4}
            p={4}
            flex="1"
            pb="80px"
            width="100%"
            maxW="container.md"
            display="flex"
            flexDirection="column"
            alignItems="center"
            bg="rgba(255, 255, 255, 0.85)"
            backdropFilter="blur(10px)"
            borderRadius="lg"
            boxShadow="lg"
          >
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
              <>
                <Dashboard />
                
              </>
            )}
            
          </Box>
          
        } />
        
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/location" element={<Location />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/history" element={<History />} />
        <Route path ="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
    <Navigation />
    </>
  );
}

export default App;
