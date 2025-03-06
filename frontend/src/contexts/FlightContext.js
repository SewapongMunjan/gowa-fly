import React, { createContext, useState } from 'react';
import api from '../services/api';

export const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    cabinClass: 'economy'
  });
  
  const [searchResults, setSearchResults] = useState({
    flights: [],
    returnFlights: [],
    loading: false,
    error: null
  });
  
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loadingPopularRoutes, setLoadingPopularRoutes] = useState(false);

  // Search flights
  const searchFlights = async (searchData) => {
    setSearchResults({
      ...searchResults,
      loading: true,
      error: null
    });
    
    try {
      // Update search params
      setSearchParams(searchData);
      
      // Build query params
      const queryParams = new URLSearchParams({
        from: searchData.from,
        to: searchData.to,
        date: searchData.date,
        passengers: JSON.stringify(searchData.passengers),
        cabinClass: searchData.cabinClass
      });
      
      // Add return date if provided
      if (searchData.returnDate) {
        queryParams.append('returnDate', searchData.returnDate);
      }
      
      const res = await api.get(`/flights/search?${queryParams}`);
      
      setSearchResults({
        flights: res.data.flights || [],
        returnFlights: res.data.returnFlights || [],
        loading: false,
        error: null
      });
      
      return { success: true, data: res.data };
    } catch (err) {
      setSearchResults({
        flights: [],
        returnFlights: [],
        loading: false,
        error: err.response?.data?.message || 'เกิดข้อผิดพลาดในการค้นหาเที่ยวบิน'
      });
      
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Get flight details
  const getFlightDetails = async (flightId) => {
    try {
      const res = await api.get(`/flights/${flightId}`);
      return { success: true, flight: res.data.flight };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลเที่ยวบิน' 
      };
    }
  };

  // Get popular routes
  const getPopularRoutes = async () => {
    setLoadingPopularRoutes(true);
    
    try {
      const res = await api.get('/flights/popular');
      setPopularRoutes(res.data.routes);
      setLoadingPopularRoutes(false);
      
      return { success: true, routes: res.data.routes };
    } catch (err) {
      setLoadingPopularRoutes(false);
      return { 
        success: false, 
        error: err.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลเส้นทางยอดนิยม' 
      };
    }
  };

  // Get flight status
  const getFlightStatus = async (flightNumber) => {
    try {
      const res = await api.get(`/flights/status/${flightNumber}`);
      return { success: true, flight: res.data.flight };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงสถานะเที่ยวบิน' 
      };
    }
  };

  // Calculate total passengers
  const getTotalPassengers = () => {
    return (
      searchParams.passengers.adults +
      searchParams.passengers.children +
      searchParams.passengers.infants
    );
  };

  return (
    <FlightContext.Provider
      value={{
        searchParams,
        setSearchParams,
        searchResults,
        searchFlights,
        selectedFlight,
        setSelectedFlight,
        selectedReturnFlight,
        setSelectedReturnFlight,
        getFlightDetails,
        popularRoutes,
        loadingPopularRoutes,
        getPopularRoutes,
        getFlightStatus,
        getTotalPassengers
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};