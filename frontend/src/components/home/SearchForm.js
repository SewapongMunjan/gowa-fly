import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightContext } from '../../../contexts/FlightContext';
import './SearchForm.css';

const SearchForm = () => {
  const { searchParams, setSearchParams, searchFlights } = useContext(FlightContext);
  const navigate = useNavigate();

  const [tripType, setTripType] = useState('เที่ยวเดียว');
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [cabinClass, setCabinClass] = useState('economy');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  // Get today's date formatted as YYYY-MM-DD for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Handle passenger count changes
  const handlePassengerChange = (type, operation) => {
    setPassengers(prev => {
      const newCount = operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      
      // Specific rules
      if (type === 'adults' && newCount < 1) {
        return prev; // At least 1 adult required
      }
      if (type === 'infants' && newCount > prev.adults) {
        return prev; // Cannot have more infants than adults
      }
      
      return {
        ...prev,
        [type]: newCount
      };
    });
  };

  // Get total passenger count for display
  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants;
  };

  // Handle swapping from and to airports
  const handleSwapAirports = () => {
    setFromAirport(toAirport);
    setToAirport(fromAirport);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!fromAirport || !toAirport || !departureDate) {
      alert('กรุณากรอกข้อมูลต้นทาง, ปลายทาง และวันเดินทางให้ครบถ้วน');
      return;
    }
    
    if (tripType === 'ไป-กลับ' && !returnDate) {
      alert('กรุณาเลือกวันเดินทางกลับ');
      return;
    }
    
    // Prepare search parameters
    const searchData = {
      from: fromAirport.trim(),
      to: toAirport.trim(),
      date: departureDate,
      returnDate: tripType === 'ไป-กลับ' ? returnDate : null,
      passengers,
      cabinClass
    };
    
    // Update context and perform search
    try {
      // Update search parameters in context
      setSearchParams(searchData);
      
      // Redirect to flights page
      navigate('/flights');
    } catch (error) {
      console.error('Search error:', error);
      alert('เกิดข้อผิดพลาดในการค้นหาเที่ยวบิน โปรดลองอีกครั้ง');
    }
  };

  return (
    <div className="search-form-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="trip-type-selector">
          <div 
            className={`trip-type-option ${tripType === 'เที่ยวเดียว' ? 'active' : ''}`}
            onClick={() => setTripType('เที่ยวเดียว')}
          >
            <span>เที่ยวเดียว</span>
          </div>
          <div 
            className={`trip-type-option ${tripType === 'ไป-กลับ' ? 'active' : ''}`}
            onClick={() => setTripType('ไป-กลับ')}
          >
            <span>ไป-กลับ</span>
          </div>
        </div>

        <div className="search-form-row">
          <div className="search-form-field location-field">
            <label htmlFor="from">จาก</label>
            <input
              type="text"
              id="from"
              placeholder="กรุงเทพ (BKK)"
              value={fromAirport}
              onChange={(e) => setFromAirport(e.target.value)}
              required
            />
          </div>

          <button 
            type="button" 
            className="swap-button"
            onClick={handleSwapAirports}
            aria-label="สลับสนามบิน"
          >
            <i className="fas fa-exchange-alt"></i>
          </button>

          <div className="search-form-field location-field">
            <label htmlFor="to">ไปยัง</label>
            <input
              type="text"
              id="to"
              placeholder="เชียงใหม่ (CNX)"
              value={toAirport}
              onChange={(e) => setToAirport(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="search-form-row">
          <div className="search-form-field date-field">
            <label htmlFor="departure-date">วันที่เดินทาง</label>
            <input
              type="date"
              id="departure-date"
              min={today}
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </div>

          <div className="search-form-field date-field">
            <label htmlFor="return-date">วันที่เดินทางกลับ</label>
            <input
              type="date"
              id="return-date"
              min={departureDate || today}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              disabled={tripType === 'เที่ยวเดียว'}
              required={tripType === 'ไป-กลับ'}
            />
          </div>
        </div>

        <div className="search-form-row">
          <div className="search-form-field passenger-field">
            <label>ผู้โดยสาร</label>
            <div className="passenger-selector">
              <button
                type="button"
                className="passenger-display"
                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
              >
                <span>{getTotalPassengers()} ผู้โดยสาร</span>
                <i className={`fas fa-chevron-${showPassengerDropdown ? 'up' : 'down'}`}></i>
              </button>

              {showPassengerDropdown && (
                <div className="passenger-dropdown">
                  <div className="passenger-type">
                    <div className="passenger-info">
                      <h4>ผู้ใหญ่</h4>
                      <p>อายุ 12 ปีขึ้นไป</p>
                    </div>
                    <div className="passenger-controls">
                      <button
                        type="button"
                        className="passenger-control-btn"
                        onClick={() => handlePassengerChange('adults', 'subtract')}
                        disabled={passengers.adults <= 1}
                      >
                        -
                      </button>
                      <span>{passengers.adults}</span>
                      <button
                        type="button"
                        className="passenger-control-btn"
                        onClick={() => handlePassengerChange('adults', 'add')}
                        disabled={getTotalPassengers() >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="passenger-type">
                    <div className="passenger-info">
                      <h4>เด็ก</h4>
                      <p>อายุ 2-11 ปี</p>
                    </div>
                    <div className="passenger-controls">
                      <button
                        type="button"
                        className="passenger-control-btn"
                        onClick={() => handlePassengerChange('children', 'subtract')}
                        disabled={passengers.children <= 0}
                      >
                        -
                      </button>
                      <span>{passengers.children}</span>
                      <button
                        type="button"
                        className="passenger-control-btn"
                        onClick={() => handlePassengerChange('children', 'add')}
                        disabled={getTotalPassengers() >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="passenger-type">
                    <div className="passenger-info">
                      <h4>ทารก</h4>
                      <p>อายุต่ำกว่า 2 ปี</p>
                    </div>
                    <div className="passenger-controls">
                      <button
                        type="button"
                        className="passenger-control-btn"
                        onClick={() => handlePassengerChange('infants', 'subtract')}
                        disabled={passengers.infants <= 0}
                      >
                        -
                      </button>
                      <span>{passengers.infants}</span>
                      <button
                        type="button"
                        className="passenger-control-btn"
                        onClick={() => handlePassengerChange('infants', 'add')}
                        disabled={passengers.infants >= passengers.adults || getTotalPassengers() >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="passenger-done-btn"
                    onClick={() => setShowPassengerDropdown(false)}
                  >
                    เสร็จสิ้น
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="search-form-field class-field">
            <label htmlFor="cabin-class">ชั้นโดยสาร</label>
            <select
              id="cabin-class"
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
            >
              <option value="economy">ชั้นประหยัด</option>
              <option value="business">ชั้นธุรกิจ</option>
              <option value="first">ชั้นหนึ่ง</option>
            </select>
          </div>
        </div>

        <div className="search-form-action">
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i> ค้นหาเที่ยวบิน
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;