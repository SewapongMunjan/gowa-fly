import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const [showFullDetails, setShowFullDetails] = useState(false);
  
  // Get booking data from location state
  const { bookingData, bookingReference } = location.state || {};
  
  // If no booking data is present, show error
  if (!bookingData || !bookingReference) {
    return (
      <div className="booking-confirmation-container">
        <div className="booking-error">
          <h2>ไม่พบข้อมูลการจอง</h2>
          <p>เกิดข้อผิดพลาดในการแสดงข้อมูลการจอง</p>
          <Link to="/" className="home-link">กลับสู่หน้าหลัก</Link>
        </div>
      </div>
    );
  }
  
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
  
  // Toggle full details display
  const toggleFullDetails = () => {
    setShowFullDetails(!showFullDetails);
  };
  
  // Handle print ticket
  const handlePrintTicket = () => {
    window.print();
  };
  
  // Render flight info
  const renderFlightInfo = (flight, isReturn = false) => {
    return (
      <div className="confirmation-flight-info">
        <div className="flight-header">
          <h3>{isReturn ? 'เที่ยวบินขากลับ' : 'เที่ยวบินขาไป'}</h3>
        </div>
        
        <div className="flight-details">
          <div className="airline-info">
            <div className="flight-number">{flight.flightNumber}</div>
            <div className="airline-name">{flight.airline}</div>
          </div>
          
          <div className="flight-route">
            <div className="departure">
              <div className="time">{formatTime(flight.departureTime)}</div>
              <div className="date">{formatDate(flight.departureTime)}</div>
              <div className="airport">
                {flight.departureAirport}
              </div>
            </div>
            
            <div className="flight-duration">
              <div className="duration-line">
                <div className="departure-dot"></div>
                <div className="duration-bar"></div>
                <div className="arrival-dot"></div>
              </div>
              <div className="duration-time">{flight.flightDuration}</div>
            </div>
            
            <div className="arrival">
              <div className="time">{formatTime(flight.arrivalTime)}</div>
              <div className="date">{formatDate(flight.arrivalTime)}</div>
              <div className="airport">
                {flight.arrivalAirport}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="booking-confirmation-container">
      <div className="booking-confirmation">
        <div className="confirmation-header">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1>การจองสำเร็จ</h1>
          <p>ขอบคุณสำหรับการจองกับ Gowa Fly</p>
        </div>
        
        <div className="booking-reference">
          <div className="reference-title">รหัสอ้างอิงการจอง</div>
          <div className="reference-code">{bookingReference}</div>
          <p className="reference-info">
            เราได้ส่งรายละเอียดการจองไปยังอีเมล {bookingData.contactDetails.email} แล้ว
          </p>
        </div>
        
        <div className="confirmation-sections">
          <div className="confirmation-section flight-section">
            <h2>รายละเอียดเที่ยวบิน</h2>
            
            {renderFlightInfo(bookingData.flightDetails)}
            
            {bookingData.returnFlightDetails && renderFlightInfo(bookingData.returnFlightDetails, true)}
          </div>
          
          <div className="confirmation-section passenger-section">
            <h2>ข้อมูลผู้โดยสาร</h2>
            
            <div className="passenger-count">
              ผู้โดยสารทั้งหมด: {bookingData.passengers.length} คน
            </div>
            
            {showFullDetails ? (
              <div className="passenger-list">
                {bookingData.passengers.map((passenger, index) => (
                  <div key={index} className="passenger-details">
                    <div className="passenger-name">
                      {passenger.title} {passenger.firstName} {passenger.lastName}
                    </div>
                    <div className="passenger-type">{passenger.type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="passenger-preview">
                <div className="passenger-details">
                  <div className="passenger-name">
                    {bookingData.passengers[0].title} {bookingData.passengers[0].firstName} {bookingData.passengers[0].lastName}
                  </div>
                  <div className="passenger-type">{bookingData.passengers[0].type}</div>
                </div>
                
                {bookingData.passengers.length > 1 && (
                  <div className="more-passengers">
                    +{bookingData.passengers.length - 1} ผู้โดยสารอื่นๆ
                  </div>
                )}
              </div>
            )}
            
            {bookingData.passengers.length > 1 && (
              <button 
                className="toggle-details-btn"
                onClick={toggleFullDetails}
              >
                {showFullDetails ? 'ซ่อนรายละเอียด' : 'แสดงรายละเอียดทั้งหมด'}
              </button>
            )}
          </div>
          
          <div className="confirmation-section contact-section">
            <h2>ข้อมูลการติดต่อ</h2>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-label">อีเมล:</div>
                <div className="contact-value">{bookingData.contactDetails.email}</div>
              </div>
              <div className="contact-item">
                <div className="contact-label">เบอร์โทรศัพท์:</div>
                <div className="contact-value">{bookingData.contactDetails.phoneNumber}</div>
              </div>
            </div>
          </div>
          
          <div className="confirmation-section payment-section">
            <h2>ข้อมูลการชำระเงิน</h2>
            
            <div className="payment-details">
              <div className="payment-item">
                <div className="payment-label">วิธีการชำระเงิน:</div>
                <div className="payment-value">{bookingData.paymentMethod}</div>
              </div>
              <div className="payment-item">
                <div className="payment-label">สถานะการชำระเงิน:</div>
                <div className="payment-value status-paid">ชำระเงินแล้ว</div>
              </div>
              <div className="payment-item total-price">
                <div className="payment-label">ราคารวม:</div>
                <div className="payment-value">฿{bookingData.totalPrice.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="confirmation-actions">
          <button 
            className="print-btn"
            onClick={handlePrintTicket}
          >
            <i className="fas fa-print"></i> พิมพ์ใบจอง
          </button>
          <Link to="/" className="home-btn">
            <i className="fas fa-home"></i> กลับสู่หน้าหลัก
          </Link>
        </div>
        
        <div className="booking-note">
          <h3>หมายเหตุสำคัญ</h3>
          <ul>
            <li>กรุณามาถึงสนามบินก่อนเวลาเดินทางอย่างน้อย 2 ชั่วโมงสำหรับเที่ยวบินในประเทศ และ 3 ชั่วโมงสำหรับเที่ยวบินระหว่างประเทศ</li>
            <li>ตรวจสอบเอกสารการเดินทางให้พร้อมก่อนการเดินทาง</li>
            <li>น้ำหนักกระเป๋าสัมภาระขึ้นอยู่กับเงื่อนไขของสายการบิน</li>
            <li>สามารถตรวจสอบสถานะการจองได้ตลอดเวลาโดยใช้รหัสอ้างอิงการจอง</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;