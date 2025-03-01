import { ChakraProvider, CSSReset, Box, Center } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import History from './pages/History';
import Navigation from './components/Navigation';
import { EmergencyProvider } from './context/EmergencyContext';

function App() {
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
            justifyContent="center"
            width="100%"
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
