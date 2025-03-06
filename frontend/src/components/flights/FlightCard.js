import React from 'react';
import './FlightCard.css';

const FlightCard = ({ flight, cabinClass = 'economy', onSelect }) => {
  // Format date and time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  // Calculate flight duration in hours and minutes
  const calculateDuration = (durationMinutes) => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}ชม. ${minutes}น.`;
  };
  
  // Get price based on cabin class
  const getPrice = () => {
    switch (cabinClass) {
      case 'business':
        return flight.price.business;
      case 'first':
        return flight.price.firstClass || flight.price.business * 1.6;
      case 'economy':
      default:
        return flight.price.economy;
    }
  };
  
  // Get cabin class in Thai
  const getCabinClassThai = () => {
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

  return (
    <div className="flight-card">
      <div className="flight-card-header">
        <div className="airline-info">
          <img 
            src={flight.airline.logo} 
            alt={flight.airline.name} 
            className="airline-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/images/airline-placeholder.png';
            }}
          />
          <div className="airline-details">
            <span className="airline-name">{flight.airline.name}</span>
            <span className="flight-number">{flight.flightNumber}</span>
          </div>
        </div>
        
        <div className="cabin-class">
          <span>{getCabinClassThai()}</span>
        </div>
      </div>
      
      <div className="flight-card-content">
        <div className="flight-route">
          <div className="departure">
            <div className="time">{formatTime(flight.departure.scheduledTime)}</div>
            <div className="date">{formatDate(flight.departure.scheduledTime)}</div>
            <div className="airport">
              <span className="airport-code">{flight.departure.iataCode}</span>
              <span className="airport-name">{flight.departure.airport}</span>
            </div>
          </div>
          
          <div className="flight-duration">
            <div className="duration-line">
              <div className="departure-dot"></div>
              <div className="duration-bar"></div>
              <div className="arrival-dot"></div>
            </div>
            <div className="duration-time">{calculateDuration(flight.duration)}</div>
            <div className="flight-type">
              {flight.aircraft.model ? `${flight.aircraft.model}` : 'ตรง'}
            </div>
          </div>
          
          <div className="arrival">
            <div className="time">{formatTime(flight.arrival.scheduledTime)}</div>
            <div className="date">{formatDate(flight.arrival.scheduledTime)}</div>
            <div className="airport">
              <span className="airport-code">{flight.arrival.iataCode}</span>
              <span className="airport-name">{flight.arrival.airport}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flight-card-footer">
        <div className="flight-price">
          <div className="price">฿{getPrice().toLocaleString()}</div>
          <div className="price-per-person">ต่อท่าน</div>
        </div>
        
        <button className="select-button" onClick={onSelect}>
          เลือกเที่ยวบินนี้
        </button>
      </div>
      
      {flight.status === 'ดีเลย์' && (
        <div className="flight-status delayed">
          <span>เที่ยวบินล่าช้า</span>
        </div>
      )}
    </div>
  );
};

export default FlightCard;