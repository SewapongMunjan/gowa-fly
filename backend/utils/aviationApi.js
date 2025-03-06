const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.AVIATION_API_KEY || 'e4bdca070c1658c0e67744f3b447fad4';
const BASE_URL = 'https://api.aviationstack.com/v1';

/**
 * Get real-time flights data
 * @param {Object} params - Query parameters for the API request
 * @returns {Promise} - API response
 */
const getRealTimeFlights = async (params = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}/flights`, {
            params: {
                access_key: API_KEY,
                ...params
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching flights data:', error);
        throw error;
    }
};

/**
 * Search flights by route (departure and arrival airports)
 * @param {string} depIata - Departure airport IATA code
 * @param {string} arrIata - Arrival airport IATA code
 * @param {string} date - Flight date (YYYY-MM-DD)
 * @returns {Promise} - API response
 */
const searchFlightsByRoute = async (depIata, arrIata, date = null) => {
    const params = {
        dep_iata: depIata,
        arr_iata: arrIata
    };
    
    // Add date filter if provided
    if (date) {
        params.flight_date = date;
    }
    
    return getRealTimeFlights(params);
};

/**
 * Search flights by airline
 * @param {string} airlineIata - Airline IATA code
 * @returns {Promise} - API response
 */
const searchFlightsByAirline = async (airlineIata) => {
    return getRealTimeFlights({ airline_iata: airlineIata });
};

/**
 * Search flights by flight number
 * @param {string} flightNumber - Flight number (with or without airline code)
 * @returns {Promise} - API response
 */
const searchFlightByNumber = async (flightNumber) => {
    return getRealTimeFlights({ flight_number: flightNumber });
};

/**
 * Get flight by API flight ID
 * @param {string} flightId - Flight ID from the API
 * @returns {Promise} - API response
 */
const getFlightById = async (flightId) => {
    return getRealTimeFlights({ id: flightId });
};

/**
 * Transform API flight data to our Flight model format
 * @param {Object} apiFlightData - Flight data from the API
 * @returns {Object} - Transformed flight data
 */
const transformFlightData = (apiFlightData) => {
    // Generate a random price between 2000-10000 THB for economy class
    const economyPrice = Math.floor(Math.random() * 8000) + 2000;
    
    return {
        flightNumber: apiFlightData.flight.iata || apiFlightData.flight.number,
        airline: {
            name: apiFlightData.airline.name || 'ไม่ทราบสายการบิน',
            iataCode: apiFlightData.airline.iata || 'N/A',
            logo: `https://content.airhex.com/content/logos/airlines_${apiFlightData.airline.iata}_200_200_s.png`
        },
        departure: {
            airport: apiFlightData.departure.airport || 'ไม่ทราบสนามบิน',
            iataCode: apiFlightData.departure.iata || 'N/A',
            terminal: apiFlightData.departure.terminal || '',
            gate: apiFlightData.departure.gate || '',
            scheduledTime: new Date(apiFlightData.departure.scheduled || Date.now()),
            estimatedTime: apiFlightData.departure.estimated ? new Date(apiFlightData.departure.estimated) : null,
            actualTime: apiFlightData.departure.actual ? new Date(apiFlightData.departure.actual) : null,
            city: apiFlightData.departure.city || 'ไม่ทราบเมือง',
            country: apiFlightData.departure.country || 'ไม่ทราบประเทศ'
        },
        arrival: {
            airport: apiFlightData.arrival.airport || 'ไม่ทราบสนามบิน',
            iataCode: apiFlightData.arrival.iata || 'N/A',
            terminal: apiFlightData.arrival.terminal || '',
            gate: apiFlightData.arrival.gate || '',
            scheduledTime: new Date(apiFlightData.arrival.scheduled || Date.now()),
            estimatedTime: apiFlightData.arrival.estimated ? new Date(apiFlightData.arrival.estimated) : null,
            actualTime: apiFlightData.arrival.actual ? new Date(apiFlightData.arrival.actual) : null,
            city: apiFlightData.arrival.city || 'ไม่ทราบเมือง',
            country: apiFlightData.arrival.country || 'ไม่ทราบประเทศ'
        },
        status: mapFlightStatus(apiFlightData.flight_status),
        aircraft: {
            model: apiFlightData.aircraft?.icao || '',
            registration: apiFlightData.aircraft?.registration || ''
        },
        duration: calculateFlightDuration(
            apiFlightData.departure.scheduled,
            apiFlightData.arrival.scheduled
        ),
        price: {
            economy: economyPrice,
            business: economyPrice * 2.5,
            firstClass: economyPrice * 4
        },
        apiFlightId: apiFlightData.flight_date + '_' + apiFlightData.flight.iata
    };
};

/**
 * Map API flight status to our status enum
 * @param {string} apiStatus - Flight status from the API
 * @returns {string} - Mapped status
 */
const mapFlightStatus = (apiStatus) => {
    const statusMap = {
        'scheduled': 'จองแล้ว',
        'active': 'อยู่ระหว่างเดินทาง',
        'landed': 'ถึงที่หมายแล้ว',
        'cancelled': 'ยกเลิก',
        'incident': 'เปลี่ยนเส้นทาง',
        'diverted': 'เปลี่ยนเส้นทาง',
        'delayed': 'ดีเลย์'
    };
    
    return statusMap[apiStatus] || 'ไม่ทราบสถานะ';
};

/**
 * Calculate flight duration in minutes
 * @param {string} departureTime - Departure time
 * @param {string} arrivalTime - Arrival time
 * @returns {number} - Duration in minutes
 */
const calculateFlightDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const diff = arrival.getTime() - departure.getTime();
    return Math.round(diff / (1000 * 60)); // Convert ms to minutes
};

module.exports = {
    getRealTimeFlights,
    searchFlightsByRoute,
    searchFlightsByAirline,
    searchFlightByNumber,
    getFlightById,
    transformFlightData
};