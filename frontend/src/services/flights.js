import api from './api';

/**
 * Search flights based on search criteria
 * @param {Object} searchParams - Search parameters
 * @returns {Promise} - Search results
 */
export const searchFlights = async (searchParams) => {
  try {
    // Convert search parameters to query string
    const queryParams = new URLSearchParams();
    
    // Add basic parameters
    if (searchParams.from) queryParams.append('from', searchParams.from);
    if (searchParams.to) queryParams.append('to', searchParams.to);
    if (searchParams.date) queryParams.append('date', searchParams.date);
    if (searchParams.returnDate) queryParams.append('returnDate', searchParams.returnDate);
    if (searchParams.cabinClass) queryParams.append('cabinClass', searchParams.cabinClass);
    
    // Add passengers as JSON string
    if (searchParams.passengers) {
      queryParams.append('passengers', JSON.stringify(searchParams.passengers));
    }
    
    const response = await api.get(`/flights/search?${queryParams}`);
    
    return {
      success: true,
      flights: response.data.flights || [],
      returnFlights: response.data.returnFlights || [],
      count: response.data.count,
      returnFlightsCount: response.data.returnFlightsCount
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการค้นหาเที่ยวบิน'
    };
  }
};

/**
 * Get flight details by ID
 * @param {string} flightId - Flight ID
 * @returns {Promise} - Flight details
 */
export const getFlightDetails = async (flightId) => {
  try {
    const response = await api.get(`/flights/${flightId}`);
    
    return {
      success: true,
      flight: response.data.flight
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลเที่ยวบิน'
    };
  }
};

/**
 * Get flight status by flight number
 * @param {string} flightNumber - Flight number
 * @returns {Promise} - Flight status
 */
export const getFlightStatus = async (flightNumber) => {
  try {
    const response = await api.get(`/flights/status/${flightNumber}`);
    
    return {
      success: true,
      flight: response.data.flight
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดสถานะเที่ยวบิน'
    };
  }
};

/**
 * Get popular flight routes
 * @returns {Promise} - Popular routes
 */
export const getPopularRoutes = async () => {
  try {
    const response = await api.get('/flights/popular');
    
    return {
      success: true,
      routes: response.data.routes,
      count: response.data.count
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดเส้นทางยอดนิยม'
    };
  }
};

/**
 * Calculate estimated flight time based on distance
 * @param {Object} from - Departure airport coordinates
 * @param {Object} to - Arrival airport coordinates
 * @returns {number} - Estimated flight time in minutes
 */
export const calculateFlightTime = (from, to) => {
  // Simple implementation - in a real app you'd use proper distance calculation
  // and consider average flight speeds, etc.
  
  // Calculate distance using Haversine formula
  const R = 6371; // Earth radius in km
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lon - from.lon);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  // Estimate flight time
  // Average commercial airplane cruising speed is ~800 km/h
  // Add 30 minutes for takeoff and landing
  const flightTimeHours = distance / 800;
  const flightTimeMinutes = Math.round(flightTimeHours * 60) + 30;
  
  return flightTimeMinutes;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
const toRad = (degrees) => {
  return degrees * Math.PI / 180;
};

/**
 * Format flight duration as a human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} - Formatted duration
 */
export const formatFlightDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}น.`;
  } else if (mins === 0) {
    return `${hours}ชม.`;
  } else {
    return `${hours}ชม. ${mins}น.`;
  }
};

/**
 * Get cabin class label in Thai
 * @param {string} cabinClass - Cabin class code
 * @returns {string} - Thai label for cabin class
 */
export const getCabinClassThai = (cabinClass) => {
  switch (cabinClass) {
    case 'business':
      return 'ชั้นธุรกิจ';
    case 'first':
      return 'ชั้นหนึ่ง';
    case 'economy':
    default:
      return 'ชั้นประหยัด';
  }
};

/**
 * Get flight type label in Thai
 * @param {string} tripType - Trip type code
 * @returns {string} - Thai label for trip type
 */
export const getTripTypeThai = (tripType) => {
  switch (tripType) {
    case 'round-trip':
      return 'ไป-กลับ';
    case 'one-way':
    default:
      return 'เที่ยวเดียว';
  }
};