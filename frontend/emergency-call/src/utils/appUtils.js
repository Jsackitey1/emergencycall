/**
 * Utility functions for the application
 */

/**
 * Forces a hard refresh of the application
 * This is useful when the app needs to be completely reloaded
 */
export const forceRefresh = () => {
  // Clear any caches that might be causing issues
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        console.log('Deleting cache:', name);
        caches.delete(name);
      });
    });
  }
  
  // Clear local storage if needed
  // localStorage.clear();
  
  // Force reload the page, bypassing the cache
  window.location.reload(true);
};

/**
 * Checks if the app is running as a PWA
 * @returns {boolean} True if the app is running in standalone mode (PWA)
 */
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone || 
         document.referrer.includes('android-app://');
};

/**
 * Gets the current app version
 * @returns {Promise<string>} The current app version
 */
export const getAppVersion = async () => {
  const response = await fetch('/path/to/version.json');
  const data = await response.json();
  return data.version; // Ensure the JSON file has a "version" field
};
