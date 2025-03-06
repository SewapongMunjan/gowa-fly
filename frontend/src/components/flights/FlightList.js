import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightContext } from '../../../contexts/FlightContext';
import FlightCard from './FlightCard';
import Loader from '../Loader';
import './FlightList.css';

const FlightList = ({ isReturn = false }) => {
  const { 
    searchResults, 
    searchParams,
    setSelectedFlight,
    setSelectedReturnFlight
  } = useContext(FlightContext);
  
  const navigate = useNavigate();
  
  const flights = isReturn ? searchResults.returnFlights : searchResults.flights;
  const loading = searchResults.loading;
  const error = searchResults.error;

  const handleSelectFlight = (flight) => {
    if (isReturn) {
      setSelectedReturnFlight(flight);
      
      // If we have both flights selected, navigate to booking page
      navigate('/booking/new');
    } else {
      setSelectedFlight(flight);
      
      // If this is a one-way trip or we don't have return flights
      if (searchParams.tripType === 'เที่ยวเดียว' || !searchResults.returnFlights?.length) {
        navigate('/booking/new');
      }
      
      // If we have selected a return flight and searching for outbound, navigate to booking
      if (searchParams.tripType === 'ไป-กลับ' && searchResults.returnFlights?.length === 0) {
        navigate('/booking/new');
      }
    }
  };

  const getFlightListTitle = () => {
    if (isReturn) {
      return `เที่ยวบินขากลับ: ${searchParams.to} ไป ${searchParams.from}`;
    } else {
      return `เที่ยวบินขาไป: ${searchParams.from} ไป ${searchParams.to}`;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flight-list-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="flight-list-empty">
        <h2 className="flight-list-title">{getFlightListTitle()}</h2>
        <div className="empty-message">
          <p>ไม่พบเที่ยวบินที่ตรงกับเงื่อนไขการค้นหา</p>
          <p>กรุณาลองเปลี่ยนเงื่อนไขการค้นหาและลองอีกครั้ง</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-list">
      <h2 className="flight-list-title">{getFlightListTitle()}</h2>
      
      <div className="flight-list-header">
        <div className="flight-list-filter">
          <label>เรียงตาม:</label>
          <select>
            <option value="price">ราคา (ต่ำไปสูง)</option>
            <option value="duration">ระยะเวลา (สั้นไปยาว)</option>
            <option value="departure">เวลาออกเดินทาง (เช้าไปเย็น)</option>
            <option value="arrival">เวลามาถึง (เช้าไปเย็น)</option>
          </select>
        </div>
        
        <div className="flight-list-count">
          <span>พบ {flights.length} เที่ยวบิน</span>
        </div>
      </div>
      
      <div className="flight-list-results">
        {flights.map((flight, index) => (
          <FlightCard 
            key={index}
            flight={flight}
            cabinClass={searchParams.cabinClass}
            onSelect={() => handleSelectFlight(flight)}
          />
        ))}
      </div>
    </div>
  );
};

export default FlightList;