import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightContext } from '../../../contexts/FlightContext';
import Loader from '../Loader';
import './PopularDestinations.css';

const PopularDestinations = ({ destinations, loading }) => {
  const navigate = useNavigate();
  const { setSearchParams } = useContext(FlightContext);

  const handleDestinationClick = (route) => {
    // Set search parameters
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formattedDate = tomorrow.toISOString().split('T')[0];
    
    setSearchParams({
      from: route.from.iataCode,
      to: route.to.iataCode,
      date: formattedDate,
      returnDate: null,
      passengers: {
        adults: 1,
        children: 0,
        infants: 0
      },
      cabinClass: 'economy'
    });
    
    // Navigate to flights page
    navigate('/flights');
  };

  if (loading) {
    return <Loader />;
  }

  if (!destinations || destinations.length === 0) {
    return (
      <div className="empty-destinations">
        <p>ไม่พบจุดหมายปลายทางยอดนิยมในขณะนี้</p>
      </div>
    );
  }

  return (
    <div className="popular-destinations">
      <div className="destinations-grid">
        {destinations.map((route, index) => (
          <div 
            key={index} 
            className="destination-card"
            onClick={() => handleDestinationClick(route)}
          >
            <div className="destination-image">
              <img src={route.imageUrl} alt={route.to.city} />
            </div>
            <div className="destination-info">
              <h3 className="destination-city">{route.to.city}</h3>
              <p className="destination-route">
                {route.from.city} - {route.to.city}
              </p>
              <p className="destination-price">
                <span className="price-label">เริ่มต้นที่</span>
                <span className="price-value">฿{route.price.toLocaleString()}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="view-all-destinations">
        <button className="view-all-btn" onClick={() => navigate('/destinations')}>
          ดูทั้งหมด
        </button>
      </div>
    </div>
  );
};

export default PopularDestinations;