import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const EmergencyContext = createContext();

export function EmergencyProvider({ children }) {
  const [contacts, setContacts] = useLocalStorage('emergency-contacts', []);
  const [settings, setSettings] = useLocalStorage('emergency-settings', {
    smsAlerts: true,
    pushNotifications: true,
    locationSharing: true,
    emergencyMessage: 'I need immediate assistance. This is an emergency.',
  });
  const [history, setHistory] = useLocalStorage('emergency-history', []);

  const addContact = (contact) => {
    setContacts(prev => [...prev, { ...contact, id: Date.now() }]);
  };

  const updateContact = (id, updatedContact) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updatedContact } : contact
    ));
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addHistoryEntry = (entry) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const value = {
    contacts,
    settings,
    history,
    addContact,
    updateContact,
    deleteContact,
    updateSettings,
    addHistoryEntry
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
} 