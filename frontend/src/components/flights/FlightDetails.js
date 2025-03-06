import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightDetails.css';

const FlightDetails = ({ flight, cabinClass = 'economy', onClose }) => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(cabinClass);
  
  if (!flight) return null;
  
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
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Format duration
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ชม. ${mins}น.`;
  };
  
  // Get price for selected cabin class
  const getPrice = (cabinClass) => {
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
  
  // Handle cabin class selection
  const handleClassChange = (cabinClass) => {
    setSelectedClass(cabinClass);
  };
  
  // Handle booking
  const handleBookFlight = () => {
    // Navigate to booking page with selected flight and cabin class
    navigate(`/booking/${flight._id}`, { 
      state: { 
        selectedClass,
        bookingType: 'flight' 
      } 
    });
  };
  
  // Amenities based on cabin class
  const getAmenities = (cabinClass) => {
    const amenities = {
      economy: [
        { icon: 'fa-suitcase', text: 'กระเป๋าโหลด 20 กก.' },
        { icon: 'fa-coffee', text: 'อาหารและเครื่องดื่ม' },
        { icon: 'fa-tv', text: 'ความบันเทิงบนเครื่อง' },
        { icon: 'fa-wifi', text: 'Wi-Fi (มีค่าใช้จ่าย)' }
      ],
      business: [
        { icon: 'fa-suitcase', text: 'กระเป๋าโหลด 40 กก.' },
        { icon: 'fa-utensils', text: 'อาหารพรีเมียม' },
        { icon: 'fa-tv', text: 'ความบันเทิงบนเครื่องระดับพรีเมียม' },
        { icon: 'fa-wifi', text: 'Wi-Fi ไม่จำกัด' },
        { icon: 'fa-bed', text: 'เก้าอี้ปรับนอนได้' },
        { icon: 'fa-glass-martini-alt', text: 'เลาจน์สนามบิน' }
      ],
      first: [
        { icon: 'fa-suitcase', text: 'กระเป๋าโหลด 50 กก.' },
        { icon: 'fa-utensils', text: 'อาหารระดับพรีเมียม' },
        { icon: 'fa-tv', text: 'ความบันเทิงส่วนตัว' },
        { icon: 'fa-wifi', text: 'Wi-Fi ความเร็วสูง' },
        { icon: 'fa-bed', text: 'เตียงนอนส่วนตัว' },
        { icon: 'fa-glass-martini-alt', text: 'เลาจน์พิเศษ' },
        { icon: 'fa-shuttle-van', text: 'บริการรับ-ส่งสนามบิน' }
      ]
    };
    
    return amenities[cabinClass] || amenities.economy;
  };
  
  return (
    <div className="flight-details-container">
      <div className="flight-details-header">
        <h2>รายละเอียดเที่ยวบิน</h2>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="flight-overview">
        <div className="flight-airline">
          <img 
            src={flight.airline.logo} 
            alt={flight.airline.name} 
            className="airline-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/images/airline-placeholder.png';
            }}
          />
          <div className="airline-info">
            <div className="airline-name">{flight.airline.name}</div>
            <div className="flight-number">{flight.flightNumber}</div>
          </div>
        </div>
        
        <div className="flight-status-badge">
          <span className={`status-${flight.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {flight.status}
          </span>
        </div>
      </div>
      
      <div className="flight-route-details">
        <div className="route-stop">
          <div className="airport-code">{flight.departure.iataCode}</div>
          <div className="airport-name">{flight.departure.airport}</div>
          <div className="city-name">{flight.departure.city}, {flight.departure.country}</div>
          <div className="flight-time">{formatTime(flight.departure.scheduledTime)}</div>
          <div className="flight-date">{formatDate(flight.departure.scheduledTime)}</div>
          {flight.departure.terminal && (
            <div className="terminal-gate">
              Terminal {flight.departure.terminal}
              {flight.departure.gate && `, Gate ${flight.departure.gate}`}
            </div>
          )}
        </div>
        
        <div className="route-line">
          <div className="plane-icon">
            <i className="fas fa-plane"></i>
          </div>
          <div className="route-duration">
            <span>{formatDuration(flight.duration)}</span>
          </div>
        </div>
        
        <div className="route-stop">
          <div className="airport-code">{flight.arrival.iataCode}</div>
          <div className="airport-name">{flight.arrival.airport}</div>
          <div className="city-name">{flight.arrival.city}, {flight.arrival.country}</div>
          <div className="flight-time">{formatTime(flight.arrival.scheduledTime)}</div>
          <div className="flight-date">{formatDate(flight.arrival.scheduledTime)}</div>
          {flight.arrival.terminal && (
            <div className="terminal-gate">
              Terminal {flight.arrival.terminal}
              {flight.arrival.gate && `, Gate ${flight.arrival.gate}`}
            </div>
          )}
        </div>
      </div>
      
      <div className="flight-details-content">
        <div className="flight-details-section">
          <h3>รายละเอียดเครื่องบิน</h3>
          <div className="details-row">
            <span className="details-label">รุ่นเครื่องบิน:</span>
            <span className="details-value">{flight.aircraft.model || 'ไม่ระบุ'}</span>
          </div>
          {flight.aircraft.registration && (
            <div className="details-row">
              <span className="details-label">ทะเบียนเครื่องบิน:</span>
              <span className="details-value">{flight.aircraft.registration}</span>
            </div>
          )}
        </div>
        
        <div className="cabin-class-selection">
          <h3>เลือกชั้นโดยสาร</h3>
          <div className="cabin-options">
            <div 
              className={`cabin-option ${selectedClass === 'economy' ? 'selected' : ''}`}
              onClick={() => handleClassChange('economy')}
            >
              <div className="cabin-name">ชั้นประหยัด</div>
              <div className="cabin-price">฿{flight.price.economy.toLocaleString()}</div>
              <div className="cabin-availability">
                ที่นั่งว่าง: {flight.seatsAvailable.economy}
              </div>
            </div>
            
            <div 
              className={`cabin-option ${selectedClass === 'business' ? 'selected' : ''}`}
              onClick={() => handleClassChange('business')}
            >
              <div className="cabin-name">ชั้นธุรกิจ</div>
              <div className="cabin-price">฿{flight.price.business.toLocaleString()}</div>
              <div className="cabin-availability">
                ที่นั่งว่าง: {flight.seatsAvailable.business}
              </div>
            </div>
            
            {flight.price.firstClass && (
              <div 
                className={`cabin-option ${selectedClass === 'first' ? 'selected' : ''}`}
                onClick={() => handleClassChange('first')}
              >
                <div className="cabin-name">ชั้นหนึ่ง</div>
                <div className="cabin-price">฿{flight.price.firstClass.toLocaleString()}</div>
                <div className="cabin-availability">
                  ที่นั่งว่าง: {flight.seatsAvailable.firstClass}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="amenities-section">
          <h3>สิ่งอำนวยความสะดวก</h3>
          <div className="amenities-list">
            {getAmenities(selectedClass).map((amenity, index) => (
              <div key={index} className="amenity-item">
                <div className="amenity-icon">
                  <i className={`fas ${amenity.icon}`}></i>
                </div>
                <div className="amenity-text">{amenity.text}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="baggage-info">
          <h3>ข้อมูลสัมภาระ</h3>
          <div className="baggage-detail">
            <div className="baggage-icon">
              <i className="fas fa-suitcase"></i>
            </div>
            <div className="baggage-text">
              <strong>สัมภาระโหลดใต้ท้องเครื่อง:</strong> 
              {selectedClass === 'economy' && ' 20 กิโลกรัม'}
              {selectedClass === 'business' && ' 40 กิโลกรัม'}
              {selectedClass === 'first' && ' 50 กิโลกรัม'}
            </div>
          </div>
          <div className="baggage-detail">
            <div className="baggage-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="baggage-text">
              <strong>สัมภาระถือขึ้นเครื่อง:</strong> 7 กิโลกรัม (ขนาดไม่เกิน 56 x 36 x 23 ซม.)
            </div>
          </div>
        </div>
      </div>
      
      <div className="flight-details-footer">
        <div className="selected-price">
          <span className="price-label">ราคารวม:</span>
          <span className="price-value">฿{getPrice(selectedClass).toLocaleString()}</span>
          <span className="price-per-person">ต่อท่าน</span>
        </div>
        
        <button className="book-button" onClick={handleBookFlight}>
          จองเที่ยวบินนี้
        </button>
      </div>
    </div>
  );
};

export default FlightDetails;