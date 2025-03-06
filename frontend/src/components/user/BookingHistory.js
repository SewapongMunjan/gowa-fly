import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import Loader from '../../common/Loader';
import './BookingHistory.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(null);
  
  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bookings');
        setBookings(response.data.bookings);
        setError(null);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // Handle view booking details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };
  
  // Handle close details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };
  
  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;
    
    try {
      setLoading(true);
      const response = await api.put(`/bookings/${cancellingBooking._id}/cancel`);
      
      // Update booking in state
      const updatedBookings = bookings.map(booking => 
        booking._id === cancellingBooking._id ? response.data.booking : booking
      );
      
      setBookings(updatedBookings);
      setCancelSuccess('ยกเลิกการจองสำเร็จ');
      setCancelError(null);
      
      // If the cancelled booking is the selected one, update it
      if (selectedBooking && selectedBooking._id === cancellingBooking._id) {
        setSelectedBooking(response.data.booking);
      }
      
      // Reset cancelling state
      setTimeout(() => {
        setCancellingBooking(null);
        setCancelSuccess(null);
      }, 3000);
    } catch (err) {
      setCancelError('เกิดข้อผิดพลาดในการยกเลิกการจอง');
      console.error('Error cancelling booking:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'รอการชำระเงิน':
        return 'status-pending';
      case 'ชำระเงินแล้ว':
        return 'status-paid';
      case 'ยกเลิก':
        return 'status-cancelled';
      case 'เสร็จสิ้น':
        return 'status-completed';
      default:
        return '';
    }
  };
  
  // Render booking status badge
  const renderStatusBadge = (status) => {
    return (
      <span className={`status-badge ${getStatusClass(status)}`}>
        {status}
      </span>
    );
  };
  
  if (loading && bookings.length === 0) {
    return <Loader />;
  }
  
  return (
    <div className="booking-history-container">
      <div className="booking-history-header">
        <h1>ประวัติการจอง</h1>
      </div>
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {cancelSuccess && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i> {cancelSuccess}
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="no-bookings-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <h2>ไม่พบประวัติการจอง</h2>
          <p>คุณยังไม่มีประวัติการจองเที่ยวบิน</p>
          <Link to="/" className="browse-flights-btn">
            ค้นหาเที่ยวบิน
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <div className="booking-ref">
                  <span className="ref-label">รหัสอ้างอิง:</span>
                  <span className="ref-value">{booking.bookingReference}</span>
                </div>
                <div className="booking-status">
                  {renderStatusBadge(booking.status)}
                </div>
              </div>
              
              <div className="booking-content">
                <div className="flight-info">
                  <div className="flight-route">
                    <div className="route-airports">
                      {booking.flightDetails.departureAirport} → {booking.flightDetails.arrivalAirport}
                    </div>
                    {booking.returnFlightDetails && (
                      <div className="trip-type-badge">ไป-กลับ</div>
                    )}
                  </div>
                  
                  <div className="flight-details">
                    <div className="flight-date">
                      <i className="far fa-calendar-alt"></i>
                      {formatDate(booking.flightDetails.departureTime)}
                    </div>
                    <div className="flight-time">
                      <i className="far fa-clock"></i>
                      {formatTime(booking.flightDetails.departureTime)}
                    </div>
                    <div className="flight-airline">
                      <i className="fas fa-plane"></i>
                      {booking.flightDetails.airline}
                    </div>
                  </div>
                </div>
                
                <div className="booking-meta">
                  <div className="booking-price">
                    <span className="price-label">ราคารวม:</span>
                    <span className="price-value">฿{booking.totalPrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="booking-date">
                    <span className="date-label">วันที่จอง:</span>
                    <span className="date-value">{formatDate(booking.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="booking-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewDetails(booking)}
                >
                  ดูรายละเอียด
                </button>
                
                {booking.status !== 'ยกเลิก' && booking.status !== 'เสร็จสิ้น' && (
                  <button 
                    className="cancel-booking-btn"
                    onClick={() => setCancellingBooking(booking)}
                  >
                    ยกเลิกการจอง
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="modal-overlay">
          <div className="booking-details-modal">
            <div className="modal-header">
              <h2>รายละเอียดการจอง</h2>
              <button className="close-modal-btn" onClick={handleCloseDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="booking-info-section">
                <div className="booking-ref-detail">
                  <span className="ref-label">รหัสอ้างอิง:</span>
                  <span className="ref-value">{selectedBooking.bookingReference}</span>
                </div>
                <div className="booking-status-detail">
                  <span className="status-label">สถานะ:</span>
                  {renderStatusBadge(selectedBooking.status)}
                </div>
              </div>
              
              <div className="flights-section">
                <h3>รายละเอียดเที่ยวบิน</h3>
                
                <div className="flight-detail-card">
                  <div className="flight-detail-header">
                    <h4>{selectedBooking.tripType === 'ไป-กลับ' ? 'เที่ยวบินขาไป' : 'เที่ยวบิน'}</h4>
                    <div className="flight-number">
                      {selectedBooking.flightDetails.flightNumber}
                    </div>
                  </div>
                  
                  <div className="flight-route-detail">
                    <div className="departure-detail">
                      <div className="airport-code">
                        {selectedBooking.flightDetails.departureAirport}
                      </div>
                      <div className="flight-time">
                        {formatTime(selectedBooking.flightDetails.departureTime)}
                      </div>
                      <div className="flight-date">
                        {formatDate(selectedBooking.flightDetails.departureTime)}
                      </div>
                    </div>
                    
                    <div className="route-line">
                      <div className="airline-name">
                        {selectedBooking.flightDetails.airline}
                      </div>
                      <div className="duration">
                        {selectedBooking.flightDetails.flightDuration}
                      </div>
                    </div>
                    
                    <div className="arrival-detail">
                      <div className="airport-code">
                        {selectedBooking.flightDetails.arrivalAirport}
                      </div>
                      <div className="flight-time">
                        {formatTime(selectedBooking.flightDetails.arrivalTime)}
                      </div>
                      <div className="flight-date">
                        {formatDate(selectedBooking.flightDetails.arrivalTime)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedBooking.returnFlightDetails && (
                  <div className="flight-detail-card">
                    <div className="flight-detail-header">
                      <h4>เที่ยวบินขากลับ</h4>
                      <div className="flight-number">
                        {selectedBooking.returnFlightDetails.flightNumber}
                      </div>
                    </div>
                    
                    <div className="flight-route-detail">
                      <div className="departure-detail">
                        <div className="airport-code">
                          {selectedBooking.returnFlightDetails.departureAirport}
                        </div>
                        <div className="flight-time">
                          {formatTime(selectedBooking.returnFlightDetails.departureTime)}
                        </div>
                        <div className="flight-date">
                          {formatDate(selectedBooking.returnFlightDetails.departureTime)}
                        </div>
                      </div>
                      
                      <div className="route-line">
                        <div className="airline-name">
                          {selectedBooking.returnFlightDetails.airline}
                        </div>
                        <div className="duration">
                          {selectedBooking.returnFlightDetails.flightDuration}
                        </div>
                      </div>
                      
                      <div className="arrival-detail">
                        <div className="airport-code">
                          {selectedBooking.returnFlightDetails.arrivalAirport}
                        </div>
                        <div className="flight-time">
                          {formatTime(selectedBooking.returnFlightDetails.arrivalTime)}
                        </div>
                        <div className="flight-date">
                          {formatDate(selectedBooking.returnFlightDetails.arrivalTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="passengers-section">
                <h3>ผู้โดยสาร</h3>
                <div className="passengers-list">
                  {selectedBooking.passengers.map((passenger, index) => (
                    <div key={index} className="passenger-detail">
                      <div className="passenger-name">
                        {passenger.title} {passenger.firstName} {passenger.lastName}
                      </div>
                      <div className="passenger-type">{passenger.type}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="contact-section">
                <h3>ข้อมูลการติดต่อ</h3>
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-label">อีเมล:</span>
                    <span className="contact-value">{selectedBooking.contactDetails.email}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">เบอร์โทรศัพท์:</span>
                    <span className="contact-value">{selectedBooking.contactDetails.phoneNumber}</span>
                  </div>
                </div>
              </div>
              
              <div className="payment-section">
                <h3>ข้อมูลการชำระเงิน</h3>
                <div className="payment-details">
                  <div className="payment-item">
                    <span className="payment-label">วิธีการชำระเงิน:</span>
                    <span className="payment-value">{selectedBooking.paymentMethod}</span>
                  </div>
                  <div className="payment-item">
                    <span className="payment-label">ราคารวม:</span>
                    <span className="payment-value price">฿{selectedBooking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              {selectedBooking.status !== 'ยกเลิก' && selectedBooking.status !== 'เสร็จสิ้น' && (
                <button 
                  className="cancel-booking-btn"
                  onClick={() => setCancellingBooking(selectedBooking)}
                >
                  ยกเลิกการจอง
                </button>
              )}
              <button className="print-booking-btn" onClick={() => window.print()}>
                <i className="fas fa-print"></i> พิมพ์การจอง
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cancel Booking Confirmation Modal */}
      {cancellingBooking && (
        <div className="modal-overlay">
          <div className="cancel-booking-modal">
            <div className="modal-header">
              <h2>ยืนยันการยกเลิกการจอง</h2>
              <button 
                className="close-modal-btn" 
                onClick={() => setCancellingBooking(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="confirmation-message">
                <div className="warning-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <p>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจอง?</p>
                <p>รหัสอ้างอิง: <strong>{cancellingBooking.bookingReference}</strong></p>
                <p>เที่ยวบิน: <strong>{cancellingBooking.flightDetails.departureAirport} - {cancellingBooking.flightDetails.arrivalAirport}</strong></p>
                <p>วันที่: <strong>{formatDate(cancellingBooking.flightDetails.departureTime)}</strong></p>
              </div>
              
              <div className="cancel-policy">
                <h3>นโยบายการยกเลิก</h3>
                <ul>
                  <li>ภายหลังการยกเลิก อาจมีค่าธรรมเนียมการยกเลิกตามเงื่อนไขของสายการบิน</li>
                  <li>การยกเลิกไม่สามารถย้อนกลับได้</li>
                  <li>หากมีข้อสงสัย กรุณาติดต่อฝ่ายบริการลูกค้า</li>
                </ul>
              </div>
              
              {cancelError && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {cancelError}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="back-btn" 
                onClick={() => setCancellingBooking(null)}
              >
                ย้อนกลับ
              </button>
              <button 
                className="confirm-cancel-btn" 
                onClick={handleCancelBooking}
                disabled={loading}
              >
                {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;