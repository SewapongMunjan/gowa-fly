import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FlightContext } from '../contexts/FlightContext';
import SearchForm from '../components/home/SearchForm';
import FlightList from '../components/flights/FlightList';
import FlightFilter from '../components/flights/FlightFilter';
import Loader from '../components/common/Loader';
import AlertMessage from '../components/common/AlertMessage';
import './FlightsPage.css';

const FlightsPage = () => {
  const { 
    searchParams, 
    searchResults, 
    searchFlights,
    selectedFlight,
    selectedReturnFlight 
  } = useContext(FlightContext);
  
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [activeTab, setActiveTab] = useState('outbound');
  const [filteredOutboundFlights, setFilteredOutboundFlights] = useState([]);
  const [filteredReturnFlights, setFilteredReturnFlights] = useState([]);
  const [filters, setFilters] = useState(null);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // If no search params, redirect to home
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      navigate('/');
      return;
    }
    
    // If navigating back from flight details or booking, don't search again
    if (searchResults.flights.length === 0 && searchResults.returnFlights.length === 0) {
      // Perform search with current params
      const performSearch = async () => {
        try {
          await searchFlights(searchParams);
        } catch (err) {
          setError('เกิดข้อผิดพลาดในการค้นหาเที่ยวบิน โปรดลองอีกครั้ง');
        }
      };
      
      performSearch();
    }
    
    // Set active tab based on selections
    if (selectedFlight && !selectedReturnFlight && searchParams.returnDate) {
      setActiveTab('return');
    } else {
      setActiveTab('outbound');
    }
  }, [searchParams, searchResults, searchFlights, navigate, selectedFlight, selectedReturnFlight]);
  
  // Update filtered flights when search results or filters change
  useEffect(() => {
    if (filters) {
      // Apply filters to flights
      filterFlights(filters);
    } else {
      // No filters, use all flights
      setFilteredOutboundFlights(searchResults.flights);
      setFilteredReturnFlights(searchResults.returnFlights);
    }
  }, [searchResults, filters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    filterFlights(newFilters);
  };
  
  // Apply filters to flights
  const filterFlights = (filters) => {
    // Filter outbound flights
    const filteredOutbound = searchResults.flights.filter(flight => {
      return applyFilters(flight, filters);
    });
    
    // Filter return flights
    const filteredReturn = searchResults.returnFlights.filter(flight => {
      return applyFilters(flight, filters);
    });
    
    // Sort flights based on selected sort option
    const sortedOutbound = sortFlights(filteredOutbound, filters.sort);
    const sortedReturn = sortFlights(filteredReturn, filters.sort);
    
    setFilteredOutboundFlights(sortedOutbound);
    setFilteredReturnFlights(sortedReturn);
  };
  
  // Apply individual filters to a flight
  const applyFilters = (flight, filters) => {
    // Filter by airline
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline.name)) {
      return false;
    }
    
    // Filter by price
    if (flight.price[searchParams.cabinClass || 'economy'] < filters.price.min || 
        flight.price[searchParams.cabinClass || 'economy'] > filters.price.max) {
      return false;
    }
    
    // Filter by duration
    if (flight.duration > filters.duration.max) {
      return false;
    }
    
    // Filter by departure time
    if (filters.departureTime.length > 0) {
      const departureHour = new Date(flight.departure.scheduledTime).getHours();
      const matchesDeparture = filters.departureTime.some(timeSlot => {
        switch (timeSlot) {
          case 'early-morning':
            return departureHour >= 0 && departureHour < 6;
          case 'morning':
            return departureHour >= 6 && departureHour < 12;
          case 'afternoon':
            return departureHour >= 12 && departureHour < 18;
          case 'evening':
            return departureHour >= 18 && departureHour < 24;
          default:
            return false;
        }
      });
      
      if (!matchesDeparture) {
        return false;
      }
    }
    
    // Filter by arrival time
    if (filters.arrivalTime.length > 0) {
      const arrivalHour = new Date(flight.arrival.scheduledTime).getHours();
      const matchesArrival = filters.arrivalTime.some(timeSlot => {
        switch (timeSlot) {
          case 'early-morning':
            return arrivalHour >= 0 && arrivalHour < 6;
          case 'morning':
            return arrivalHour >= 6 && arrivalHour < 12;
          case 'afternoon':
            return arrivalHour >= 12 && arrivalHour < 18;
          case 'evening':
            return arrivalHour >= 18 && arrivalHour < 24;
          default:
            return false;
        }
      });
      
      if (!matchesArrival) {
        return false;
      }
    }
    
    // Filter by stops (not implemented in this demo)
    // In a real application, you would filter by the number of stops in the flight
    
    return true;
  };
  
  // Sort flights based on selected sort option
  const sortFlights = (flights, sortOption) => {
    const sortedFlights = [...flights];
    
    switch (sortOption) {
      case 'price-asc':
        return sortedFlights.sort((a, b) => 
          a.price[searchParams.cabinClass || 'economy'] - b.price[searchParams.cabinClass || 'economy']
        );
      case 'price-desc':
        return sortedFlights.sort((a, b) => 
          b.price[searchParams.cabinClass || 'economy'] - a.price[searchParams.cabinClass || 'economy']
        );
      case 'duration':
        return sortedFlights.sort((a, b) => a.duration - b.duration);
      case 'departure':
        return sortedFlights.sort((a, b) => 
          new Date(a.departure.scheduledTime) - new Date(b.departure.scheduledTime)
        );
      case 'arrival':
        return sortedFlights.sort((a, b) => 
          new Date(a.arrival.scheduledTime) - new Date(b.arrival.scheduledTime)
        );
      default:
        return sortedFlights;
    }
  };
  
  // Toggle search form visibility
  const toggleSearchForm = () => {
    setShowSearchForm(!showSearchForm);
  };
  
  // Format the route display
  const formatRoute = () => {
    if (!searchParams.from || !searchParams.to) return '';
    return `${searchParams.from} - ${searchParams.to}`;
  };
  
  // Format the date display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Get passenger count display
  const getPassengerDisplay = () => {
    const { passengers } = searchParams;
    if (!passengers) return '1 ผู้โดยสาร';
    
    const total = passengers.adults + (passengers.children || 0) + (passengers.infants || 0);
    return `${total} ผู้โดยสาร`;
  };
  
  // Loading state
  if (searchResults.loading) {
    return (
      <div className="flights-page">
        <div className="container">
          <div className="search-summary">
            <div className="route-info">
              <h1>{formatRoute()}</h1>
              <div className="date-info">
                <span>{formatDate(searchParams.date)}</span>
                {searchParams.returnDate && (
                  <span> - {formatDate(searchParams.returnDate)}</span>
                )}
              </div>
              <div className="passenger-info">
                {getPassengerDisplay()}
              </div>
            </div>
          </div>
          <Loader />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flights-page">
      <div className="container">
        {error && (
          <AlertMessage 
            message={error} 
            type="error" 
            onClose={() => setError(null)} 
          />
        )}
        
        <div className="search-summary">
          <div className="route-info">
            <h1>{formatRoute()}</h1>
            <div className="date-info">
              <span>{formatDate(searchParams.date)}</span>
              {searchParams.returnDate && (
                <span> - {formatDate(searchParams.returnDate)}</span>
              )}
            </div>
            <div className="passenger-info">
              {getPassengerDisplay()}
            </div>
          </div>
          <button 
            className="modify-search-btn"
            onClick={toggleSearchForm}
          >
            {showSearchForm ? 'ซ่อนการค้นหา' : 'แก้ไขการค้นหา'}
          </button>
        </div>
        
        {showSearchForm && (
          <div className="search-form-wrapper">
            <SearchForm />
          </div>
        )}
        
        {searchParams.returnDate && (
          <div className="flight-tabs">
            <button 
              className={`tab-btn ${activeTab === 'outbound' ? 'active' : ''}`}
              onClick={() => setActiveTab('outbound')}
            >
              เที่ยวบินขาไป
              {selectedFlight && <span className="selected-badge">เลือกแล้ว</span>}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'return' ? 'active' : ''}`}
              onClick={() => setActiveTab('return')}
              disabled={!selectedFlight}
            >
              เที่ยวบินขากลับ
              {selectedReturnFlight && <span className="selected-badge">เลือกแล้ว</span>}
            </button>
          </div>
        )}
        
        <div className="flights-container">
          <div className="flights-sidebar">
            <FlightFilter 
              flights={activeTab === 'outbound' ? searchResults.flights : searchResults.returnFlights}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="flights-content">
            {activeTab === 'outbound' ? (
              <FlightList 
                isReturn={false}
              />
            ) : (
              <FlightList 
                isReturn={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightsPage;