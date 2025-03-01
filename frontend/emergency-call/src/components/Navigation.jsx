import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { FaHome, FaAddressBook, FaCog, FaHistory } from 'react-icons/fa';

const Navigation = () => {
  const location = useLocation();
  const bgColor = useColorModeValue(
    'rgba(255, 255, 255, 0.95)',
    'rgba(26, 32, 44, 0.95)'
  );

  const isActive = (path) => location.pathname === path;

  const NAV_ITEMS = [
    { name: 'Dashboard', path: '/', icon: FaHome },
    { name: 'Contacts', path: '/contacts', icon: FaAddressBook },
    { name: 'Settings', path: '/settings', icon: FaCog },
    { name: 'History', path: '/history', icon: FaHistory },
  ];

  return (
    <Box
      bg={bgColor}
      px={4}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      borderTopWidth={1}
      shadow="lg"
      style={{ 
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <Flex h={16} alignItems="center" justifyContent="space-around">
        <HStack spacing={4}>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.path}
              as={RouterLink}
              to={item.path}
              variant={isActive(item.path) ? 'solid' : 'ghost'}
              colorScheme={isActive(item.path) ? 'blue' : 'gray'}
              leftIcon={<item.icon />}
              size="sm"
              _hover={{
                bg: isActive(item.path) ? 'blue.500' : 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
            >
              {item.name}
            </Button>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigation;