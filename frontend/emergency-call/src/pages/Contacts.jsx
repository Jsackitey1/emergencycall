import { useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  Box,
  Text,
  HStack,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { useEmergency } from '../context/EmergencyContext';

const Contacts = () => {
  const { contacts, addContact, updateContact, deleteContact } = useEmergency();
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (isEditing) {
      updateContact(editingId, newContact);
      setIsEditing(false);
      setEditingId(null);
    } else {
      addContact(newContact);
    }

    setNewContact({ name: '', phone: '' });
    toast({
      title: isEditing ? 'Contact Updated' : 'Contact Added',
      status: 'success',
      duration: 2000,
    });
  };

  const handleEdit = (contact) => {
    setNewContact({ name: contact.name, phone: contact.phone });
    setIsEditing(true);
    setEditingId(contact.id);
  };

  const handleDelete = (id) => {
    deleteContact(id);
    toast({
      title: 'Contact Deleted',
      status: 'info',
      duration: 2000,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch" width = '430px' height = '630px'>
        <Heading textAlign="center">Emergency Contacts</Heading>

        <Box>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="Contact Name"
              mb={3}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              placeholder="Phone Number"
              mb={3}
              type="tel"
            />
          </FormControl>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            onClick={handleAddContact}
            width="full"
          >
            {isEditing ? 'Update Contact' : 'Add Contact'}
          </Button>
        </Box>

        <VStack spacing={4} align="stretch">
          {contacts.map((contact) => (
            <Box
              key={contact.id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              shadow="sm"
            >
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{contact.name}</Text>
                  <Text color="gray.600">{contact.phone}</Text>
                </VStack>
                <HStack>
                  <IconButton
                    icon={<FaEdit />}
                    onClick={() => handleEdit(contact)}
                    aria-label="Edit contact"
                    colorScheme="blue"
                    size="sm"
                  />
                  <IconButton
                    icon={<FaTrash />}
                    onClick={() => handleDelete(contact.id)}
                    aria-label="Delete contact"
                    colorScheme="red"
                    size="sm"
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Contacts; 