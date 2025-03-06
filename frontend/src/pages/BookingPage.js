import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FlightContext } from '../contexts/FlightContext';
import { AuthContext } from '../contexts/AuthContext';
import BookingForm from '../components/booking/BookingForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import Loader from '../components/common/Loader';
import './BookingPage.css';

const BookingPage = () => {
  const { flightId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { getFlightDetails, selectedFlight, setSelectedFlight } = useContext(FlightContext);
  const { isAuthenticated } = useContext(AuthContext);
  
  // Check if we're in confirmation mode or booking mode
  const isConfirmation = location.pathname.includes('/confirmation');
  
  useEffect(() => {
    // If already in confirmation mode, don't fetch flight
    if (isConfirmation) return;
    
    // Verify user is authenticated
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // If it's a new booking (not a stored flight)
    if (flightId && flightId !== 'new' && !selectedFlight) {
      const loadFlightDetails = async () => {
        const response = await getFlightDetails(flightId);
        
        if (!response.success) {
          // If flight not found, redirect to flights page
          navigate('/flights');
        }
      };
      
      loadFlightDetails();
    }
    
    // If no flight is selected, redirect to flights page
    if (!selectedFlight && flightId !== 'new') {
      navigate('/flights');
    }
    
    // Clean up when component unmounts
    return () => {
      if (isConfirmation) {
        // Clear selected flight after confirmation is completed
        setSelectedFlight(null);
      }
    };
  }, [flightId, selectedFlight, isAuthenticated, navigate, location.pathname, getFlightDetails, setSelectedFlight, isConfirmation]);
  
  // If no selected flight and not in confirmation mode, show loader
  if (!selectedFlight && !isConfirmation && flightId !== 'new') {
    return <Loader />;
  }
  
  return (
    <div className="booking-page">
      <div className="container">
        {isConfirmation ? (
          <BookingConfirmation />
        ) : (
          <BookingForm />
        )}
      </div>
    </div>
  );
};

export default BookingPage;