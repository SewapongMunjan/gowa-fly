import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightContext } from '../../../contexts/FlightContext';
import { AuthContext } from '../../../contexts/AuthContext';
import PassengerInfo from './PassengerInfo';
import PaymentForm from './PaymentForm';
import './BookingForm.css';

const BookingForm = () => {
  const { selectedFlight, selectedReturnFlight, searchParams } = useContext(FlightContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [contactInfo, setContactInfo] = useState({
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [passengers, setPassengers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('บัตรเครดิต');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize passengers based on search params
  useEffect(() => {
    if (searchParams && searchParams.passengers) {
      const newPassengers = [];
      
      // Add adult passengers
      for (let i = 0; i < searchParams.passengers.adults; i++) {
        newPassengers.push({
          type: 'ผู้ใหญ่',
          title: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          nationality: 'ไทย',
          passportNumber: '',
          passportExpiry: ''
        });
      }
      
      // Add child passengers
      for (let i = 0; i < searchParams.passengers.children; i++) {
        newPassengers.push({
          type: 'เด็ก',
          title: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          nationality: 'ไทย',
          passportNumber: '',
          passportExpiry: ''
        });
      }
      
      // Add infant passengers
      for (let i = 0; i < searchParams.passengers.infants; i++) {
        newPassengers.push({
          type: 'ทารก',
          title: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          nationality: 'ไทย',
          passportNumber: '',
          passportExpiry: ''
        });
      }
      
      setPassengers(newPassengers);
    }
  }, [searchParams]);

  // Calculate total price
  useEffect(() => {
    if (selectedFlight) {
      let price = 0;
      
      // Get per-passenger price based on cabin class
      const adultPrice = getPassengerPrice(selectedFlight, 'adult');
      const childPrice = getPassengerPrice(selectedFlight, 'child');
      const infantPrice = getPassengerPrice(selectedFlight, 'infant');
      
      // Calculate for outbound flight
      if (searchParams && searchParams.passengers) {
        price += adultPrice * searchParams.passengers.adults;
        price += childPrice * searchParams.passengers.children;
        price += infantPrice * searchParams.passengers.infants;
      }
      
      // Add return flight price if applicable
      if (selectedReturnFlight) {
        const returnAdultPrice = getPassengerPrice(selectedReturnFlight, 'adult');
        const returnChildPrice = getPassengerPrice(selectedReturnFlight, 'child');
        const returnInfantPrice = getPassengerPrice(selectedReturnFlight, 'infant');
        
        if (searchParams && searchParams.passengers) {
          price += returnAdultPrice * searchParams.passengers.adults;
          price += returnChildPrice * searchParams.passengers.children;
          price += returnInfantPrice * searchParams.passengers.infants;
        }
      }
      
      setTotalPrice(price);
    }
  }, [selectedFlight, selectedReturnFlight, searchParams]);

  // Get price based on passenger type and cabin class
  const getPassengerPrice = (flight, passengerType) => {
    const cabinClass = searchParams?.cabinClass || 'economy';
    let price = 0;
    
    switch (cabinClass) {
      case 'business':
        price = flight.price.business;
        break;
      case 'first':
        price = flight.price.firstClass;
        break;
      case 'economy':
      default:
        price = flight.price.economy;
        break;
    }
    
    // Apply discounts based on passenger type
    switch (passengerType) {
      case 'child':
        return price * 0.75; // 25% discount for children
      case 'infant':
        return price * 0.1; // 90% discount for infants
      case 'adult':
      default:
        return price;
    }
  };

  // Handle contact info change
  const handleContactInfoChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };

  // Handle passenger info change
  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Move to next step
  const nextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      // Validate contact info
      if (!contactInfo.email || !contactInfo.phoneNumber) {
        setError('กรุณากรอกข้อมูลติดต่อให้ครบถ้วน');
        return;
      }
      
      // Validate passenger info
      let isValid = true;
      passengers.forEach(passenger => {
        if (
          !passenger.title ||
          !passenger.firstName ||
          !passenger.lastName ||
          !passenger.dateOfBirth ||
          !passenger.nationality
        ) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        setError('กรุณากรอกข้อมูลผู้โดยสารให้ครบถ้วน');
        return;
      }
    }
    
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  // Move to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Prepare booking data
      const bookingData = {
        flightDetails: {
          flightNumber: selectedFlight.flightNumber,
          airline: selectedFlight.airline.name,
          departureAirport: selectedFlight.departure.iataCode,
          arrivalAirport: selectedFlight.arrival.iataCode,
          departureTime: selectedFlight.departure.scheduledTime,
          arrivalTime: selectedFlight.arrival.scheduledTime,
          flightDuration: selectedFlight.duration,
          apiFlightId: selectedFlight._id
        },
        returnFlightDetails: selectedReturnFlight ? {
          flightNumber: selectedReturnFlight.flightNumber,
          airline: selectedReturnFlight.airline.name,
          departureAirport: selectedReturnFlight.departure.iataCode,
          arrivalAirport: selectedReturnFlight.arrival.iataCode,
          departureTime: selectedReturnFlight.departure.scheduledTime,
          arrivalTime: selectedReturnFlight.arrival.scheduledTime,
          flightDuration: selectedReturnFlight.duration,
          apiFlightId: selectedReturnFlight._id
        } : null,
        passengers,
        contactDetails: contactInfo,
        tripType: selectedReturnFlight ? 'ไป-กลับ' : 'เที่ยวเดียว',
        paymentMethod,
        totalPrice
      };
      
      // Send booking request
      // In a real app, you would call your API here
      // const response = await api.post('/bookings', bookingData);
      
      // Simulate API call
      setTimeout(() => {
        // Navigate to confirmation page
        navigate('/booking/confirmation', {
          state: {
            bookingData,
            bookingReference: generateBookingReference()
          }
        });
        
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการสร้างการจอง โปรดลองอีกครั้ง');
      setLoading(false);
    }
  };

  // Generate booking reference
  const generateBookingReference = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Format flight time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  // Format flight date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get cabin class name in Thai
  const getCabinClassThai = () => {
    const cabinClass = searchParams?.cabinClass || 'economy';
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

  // Render flight info
  const renderFlightInfo = (flight, isReturn = false) => {
    return (
      <div className="booking-flight-info">
        <div className="flight-header">
          <h3>{isReturn ? 'เที่ยวบินขากลับ' : 'เที่ยวบินขาไป'}</h3>
          <span className="cabin-class">{getCabinClassThai()}</span>
        </div>
        
        <div className="flight-card">
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
            <div>
              <div className="airline-name">{flight.airline.name}</div>
              <div className="flight-number">{flight.flightNumber}</div>
            </div>
          </div>
          
          <div className="flight-route">
            <div className="departure">
              <div className="time">{formatTime(flight.departure.scheduledTime)}</div>
              <div className="date">{formatDate(flight.departure.scheduledTime)}</div>
              <div className="airport">
                <div className="airport-code">{flight.departure.iataCode}</div>
                <div className="airport-name">{flight.departure.airport}</div>
                <div className="city">{flight.departure.city}</div>
              </div>
            </div>
            
            <div className="flight-duration">
              <div className="duration-line">
                <div className="departure-dot"></div>
                <div className="duration-bar"></div>
                <div className="arrival-dot"></div>
              </div>
              <div className="duration-time">
                {Math.floor(flight.duration / 60)}ชม. {flight.duration % 60}น.
              </div>
            </div>
            
            <div className="arrival">
              <div className="time">{formatTime(flight.arrival.scheduledTime)}</div>
              <div className="date">{formatDate(flight.arrival.scheduledTime)}</div>
              <div className="airport">
                <div className="airport-code">{flight.arrival.iataCode}</div>
                <div className="airport-name">{flight.arrival.airport}</div>
                <div className="city">{flight.arrival.city}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If no flight is selected, redirect to search page
  if (!selectedFlight) {
    navigate('/flights');
    return null;
  }

  return (
    <div className="booking-form-container">
      <div className="booking-steps">
        <div className={`booking-step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-text">ข้อมูลผู้โดยสาร</div>
        </div>
        <div className={`booking-step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-text">ชำระเงิน</div>
        </div>
        <div className={`booking-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-text">ยืนยันการจอง</div>
        </div>
      </div>
      
      {error && (
        <div className="booking-error">
          <p>{error}</p>
        </div>
      )}
      
      <div className="booking-form-content">
        <div className="booking-form-left">
          {/* Step 1: Passenger Information */}
          {currentStep === 1 && (
            <div className="passenger-step">
              <h2>ข้อมูลผู้โดยสาร</h2>
              
              <div className="contact-section">
                <h3>ข้อมูลการติดต่อ</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">อีเมล</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactInfoChange}
                      placeholder="กรอกอีเมลของคุณ"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phoneNumber">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={contactInfo.phoneNumber}
                      onChange={handleContactInfoChange}
                      placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <PassengerInfo
                passengers={passengers}
                onChange={handlePassengerChange}
              />
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="next-btn"
                  onClick={nextStep}
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="payment-step">
              <h2>ข้อมูลการชำระเงิน</h2>
              
              <PaymentForm
                paymentMethod={paymentMethod}
                onChange={handlePaymentMethodChange}
              />
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={prevStep}
                >
                  ย้อนกลับ
                </button>
                <button 
                  type="button" 
                  className="next-btn"
                  onClick={nextStep}
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="confirmation-step">
              <h2>ยืนยันการจอง</h2>
              
              <div className="confirmation-section">
                <h3>ข้อมูลการติดต่อ</h3>
                <div className="confirmation-row">
                  <span className="confirmation-label">อีเมล:</span>
                  <span className="confirmation-value">{contactInfo.email}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">เบอร์โทรศัพท์:</span>
                  <span className="confirmation-value">{contactInfo.phoneNumber}</span>
                </div>
              </div>
              
              <div className="confirmation-section">
                <h3>ข้อมูลผู้โดยสาร</h3>
                {passengers.map((passenger, index) => (
                  <div key={index} className="passenger-summary">
                    <div className="passenger-header">
                      <h4>ผู้โดยสารคนที่ {index + 1} ({passenger.type})</h4>
                    </div>
                    <div className="confirmation-row">
                      <span className="confirmation-label">ชื่อ-นามสกุล:</span>
                      <span className="confirmation-value">
                        {passenger.title} {passenger.firstName} {passenger.lastName}
                      </span>
                    </div>
                    <div className="confirmation-row">
                      <span className="confirmation-label">วันเกิด:</span>
                      <span className="confirmation-value">{passenger.dateOfBirth}</span>
                    </div>
                    <div className="confirmation-row">
                      <span className="confirmation-label">สัญชาติ:</span>
                      <span className="confirmation-value">{passenger.nationality}</span>
                    </div>
                    {passenger.passportNumber && (
                      <div className="confirmation-row">
                        <span className="confirmation-label">หมายเลขพาสปอร์ต:</span>
                        <span className="confirmation-value">{passenger.passportNumber}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="confirmation-section">
                <h3>วิธีการชำระเงิน</h3>
                <div className="confirmation-row">
                  <span className="confirmation-label">วิธีการชำระเงิน:</span>
                  <span className="confirmation-value">{paymentMethod}</span>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={prevStep}
                >
                  ย้อนกลับ
                </button>
                <button 
                  type="button" 
                  className="confirm-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการจอง'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="booking-form-right">
          <div className="booking-summary">
            <h3>สรุปการจอง</h3>
            
            {renderFlightInfo(selectedFlight)}
            
            {selectedReturnFlight && renderFlightInfo(selectedReturnFlight, true)}
            
            <div className="booking-price-summary">
              <div className="price-row">
                <span className="price-label">ผู้โดยสาร:</span>
                <span className="price-value">
                  {searchParams?.passengers?.adults || 0} ผู้ใหญ่
                  {searchParams?.passengers?.children > 0 && `, ${searchParams.passengers.children} เด็ก`}
                  {searchParams?.passengers?.infants > 0 && `, ${searchParams.passengers.infants} ทารก`}
                </span>
              </div>
              <div className="price-row">
                <span className="price-label">ชั้นโดยสาร:</span>
                <span className="price-value">{getCabinClassThai()}</span>
              </div>
              <div className="price-row total">
                <span className="price-label">ราคารวม:</span>
                <span className="price-value">฿{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;