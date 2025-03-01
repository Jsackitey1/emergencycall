import {
  Container,
  VStack,
  Heading,
  Box,
  Text,
  Badge,
  HStack,
  Icon,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FaPhone, FaMapMarkerAlt, FaBell } from 'react-icons/fa';
import { useEmergency } from '../context/EmergencyContext';

const ICON_MAP = {
  emergency_call: FaPhone,
  location_share: FaMapMarkerAlt,
  alert_sent: FaBell,
};

const COLOR_MAP = {
  emergency_call: 'red',
  location_share: 'purple',
  alert_sent: 'orange',
};

const History = () => {
  const { history } = useEmergency();

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (history.length === 0) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">Emergency History</Heading>
          <Alert status="info">
            <AlertIcon />
            No emergency actions have been recorded yet.
          </Alert>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Emergency History</Heading>

        <VStack spacing={4} align="stretch">
          {history.map((log) => (
            <Box
              key={log.id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              shadow="sm"
            >
              <HStack spacing={4}>
                <Icon 
                  as={ICON_MAP[log.type] || FaBell} 
                  boxSize={6} 
                  color={`${COLOR_MAP[log.type] || 'gray'}.500`} 
                />
                <Box flex="1">
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">
                      {log.details}
                    </Text>
                    <Badge colorScheme={COLOR_MAP[log.type] || 'gray'}>
                      {log.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </HStack>
                  <Text color="gray.600" fontSize="sm">
                    {formatDate(log.timestamp)}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default History; 