import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Check if window is available (for SSR compatibility)
  const isClient = typeof window !== 'undefined';
  
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    if (!isClient) {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      if (!isClient) {
        return;
      }
      
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      // Save state
      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    if (isClient) {
      setStoredValue(readValue());
    }
  }, []);

  return [storedValue, setValue];
}
