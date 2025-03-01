import { ChakraProvider, CSSReset, Box, Center } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from './hooks/useLocation';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import History from './pages/History';
import Navigation from './components/Navigation';
import { EmergencyProvider } from './context/EmergencyContext';

function App() {
  const { location } = useLocation();

  const mapUrl = location
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=2048x2048&scale=2&maptype=roadmap&key=AIzaSyDGsTxaviBiGwRE2YKV7xxkoOHA8eUPy5k`
    : `https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=12&size=2048x2048&scale=2&maptype=roadmap&key=AIzaSyDGsTxaviBiGwRE2YKV7xxkoOHA8eUPy5k`;

  return (
    <ChakraProvider>
      <CSSReset />
      <EmergencyProvider>
        <Router>
          <Box 
            pb={20} 
            minH="100vh" 
            display="flex" 
            flexDirection="column"
            alignItems="center"
            width="100%"
            position="relative"
            zIndex={1}
            sx={{
              '&::before': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url('${mapUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: -1,
                filter: 'brightness(0.9)',
                transition: 'background-image 0.3s ease-in-out',
              }
            }}
          >
            <Box 
              className="content-wrapper" 
              mx={4} 
              my={4} 
              p={4} 
              flex="1"
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
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </Box>
            <Navigation />
          </Box>
        </Router>
      </EmergencyProvider>
    </ChakraProvider>
  );
}

export default App;
