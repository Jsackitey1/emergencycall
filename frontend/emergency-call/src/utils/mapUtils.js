/**
 * Utility functions for working with maps
 */

/**
 * Checks if the Google Maps API is loaded and available
 * @returns {boolean} True if Google Maps is loaded
 */
export const isGoogleMapsLoaded = () => {
  return typeof window !== 'undefined' && 
         typeof window.google !== 'undefined' && 
         typeof window.google.maps !== 'undefined';
};

/**
 * Creates a custom marker icon for the map
 * @param {string} color - The color of the marker (hex code)
 * @param {number} scale - The size of the marker
 * @returns {Object} Google Maps icon object
 */
export const createMarkerIcon = (color = '#4299E1', scale = 10) => {
  if (!isGoogleMapsLoaded()) return null;
  
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: scale,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
  };
};

/**
 * Calculate the distance between two coordinates in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

/**
 * Generate a random location within a specified radius of a center point
 * @param {Object} center - Center coordinates {lat, lng}
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Object} Random location {lat, lng}
 */
export const generateRandomNearbyLocation = (center, radiusKm = 2) => {
  if (!center) return null;
  
  // Convert radius from kilometers to degrees (rough approximation)
  const radiusDegrees = radiusKm / 111;
  
  const randomLat = center.lat + (Math.random() - 0.5) * radiusDegrees * 2;
  const randomLng = center.lng + (Math.random() - 0.5) * radiusDegrees * 2;
  
  return { lat: randomLat, lng: randomLng };
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};
