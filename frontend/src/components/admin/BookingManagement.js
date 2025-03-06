import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import Loader from '../../common/Loader';
import './BookingManagement.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const bookingsPerPage = 10;

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/bookings');
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

  // Filter bookings based on search term and status filter
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.user?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
      (booking.user?.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
      (booking.user?.email?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
      booking.flightDetails.flightNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Open booking details modal
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (booking) => {
    setDeleteConfirmation(booking);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setDeleteConfirmation(null);
  };

  // Handle booking status update
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      await api.put(`/admin/bookings/${bookingId}`, { status: newStatus });
      
      // Update booking in state
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      
      // Close modal
      setShowModal(false);
      setSelectedBooking(null);
      
      alert('อัปเดตสถานะการจองสำเร็จ');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัปเดตสถานะการจอง');
      console.error('Error updating booking status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async () => {
    if (!deleteConfirmation) return;
    
    try {
      setLoading(true);
      await api.delete(`/admin/bookings/${deleteConfirmation._id}`);
      
      // Remove booking from state
      setBookings(bookings.filter(booking => booking._id !== deleteConfirmation._id));
      
      // Close confirmation
      setDeleteConfirmation(null);
      
      alert('ลบข้อมูลการจองสำเร็จ');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลบข้อมูลการจอง');
      console.error('Error deleting booking:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
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

  if (loading && bookings.length === 0) {
    return <Loader />;
  }

  return (
    <div className="booking-management">
      <h1>จัดการการจอง</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="booking-management-tools">
        <div className="search-bar">
          <input
            type="text"
            placeholder="ค้นหาการจอง..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <i className="fas fa-search"></i>
        </div>

        <div className="status-filter">
          <label htmlFor="status-filter">กรองตามสถานะ:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">ทั้งหมด</option>
            <option value="รอการชำระเงิน">รอการชำระเงิน</option>
            <option value="ชำระเงินแล้ว">ชำระเงินแล้ว</option>
            <option value="ยกเลิก">ยกเลิก</option>
            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
          </select>
        </div>

        <div className="booking-count">
          แสดง {currentBookings.length} จาก {filteredBookings.length} รายการ
        </div>
      </div>

      <div className="booking-table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>รหัสอ้างอิง</th>
              <th>ผู้จอง</th>
              <th>เที่ยวบิน</th>
              <th>วันที่เดินทาง</th>
              <th>ราคารวม</th>
              <th>สถานะ</th>
              <th>วันที่จอง</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map(booking => (
              <tr key={booking._id}>
                <td>
                  <div className="booking-reference">
                    {booking.bookingReference}
                  </div>
                </td>
                <td>
                  <div className="booking-user">
                    {booking.user?.firstName} {booking.user?.lastName}
                    <div className="booking-user-email">{booking.user?.email}</div>
                  </div>
                </td>
                <td>
                  <div className="booking-flight">
                    <div>{booking.flightDetails.flightNumber}</div>
                    <div className="booking-route">
                      {booking.flightDetails.departureAirport} - {booking.flightDetails.arrivalAirport}
                    </div>
                  </div>
                </td>
                <td>{formatDate(booking.flightDetails.departureTime)}</td>
                <td>฿{booking.totalPrice.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td>{formatDate(booking.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(booking)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      ) : (
        <div className="no-results">
          <p>ไม่พบข้อมูลการจองที่ตรงกับการค้นหา</p>
        </div>
      )}

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal booking-details-modal">
            <div className="modal-header">
              <h2>รายละเอียดการจอง</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="booking-details">
              <div className="booking-detail-section">
                <h3>ข้อมูลการจอง</h3>
                <div className="detail-row">
                  <span className="detail-label">รหัสอ้างอิง:</span>
                  <span className="detail-value">{selectedBooking.bookingReference}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">วันที่จอง:</span>
                  <span className="detail-value">{formatDate(selectedBooking.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ประเภทการเดินทาง:</span>
                  <span className="detail-value">{selectedBooking.tripType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">วิธีชำระเงิน:</span>
                  <span className="detail-value">{selectedBooking.paymentMethod}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ราคารวม:</span>
                  <span className="detail-value">฿{selectedBooking.totalPrice.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">สถานะ:</span>
                  <select
                    className={`status-select ${getStatusBadgeClass(selectedBooking.status)}`}
                    value={selectedBooking.status}
                    onChange={(e) => handleUpdateStatus(selectedBooking._id, e.target.value)}
                  >
                    <option value="รอการชำระเงิน">รอการชำระเงิน</option>
                    <option value="ชำระเงินแล้ว">ชำระเงินแล้ว</option>
                    <option value="ยกเลิก">ยกเลิก</option>
                    <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                  </select>
                </div>
              </div>
              
              <div className="booking-detail-section">
                <h3>ข้อมูลผู้จอง</h3>
                <div className="detail-row">
                  <span className="detail-label">ชื่อ-นามสกุล:</span>
                  <span className="detail-value">
                    {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">อีเมล:</span>
                  <span className="detail-value">{selectedBooking.user?.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">เบอร์โทรศัพท์:</span>
                  <span className="detail-value">{selectedBooking.contactDetails.phoneNumber}</span>
                </div>
              </div>
              
              <div className="booking-detail-section">
                <h3>ข้อมูลเที่ยวบิน</h3>
                <div className="detail-row">
                  <span className="detail-label">เที่ยวบิน:</span>
                  <span className="detail-value">{selectedBooking.flightDetails.flightNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">สายการบิน:</span>
                  <span className="detail-value">{selectedBooking.flightDetails.airline}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">เส้นทาง:</span>
                  <span className="detail-value">
                    {selectedBooking.flightDetails.departureAirport} - {selectedBooking.flightDetails.arrivalAirport}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">วันและเวลาออกเดินทาง:</span>
                  <span className="detail-value">{formatDate(selectedBooking.flightDetails.departureTime)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">วันและเวลาถึง:</span>
                  <span className="detail-value">{formatDate(selectedBooking.flightDetails.arrivalTime)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ระยะเวลาบิน:</span>
                  <span className="detail-value">{selectedBooking.flightDetails.flightDuration}</span>
                </div>
              </div>
              
              {selectedBooking.returnFlightDetails && (
                <div className="booking-detail-section">
                  <h3>ข้อมูลเที่ยวบินขากลับ</h3>
                  <div className="detail-row">
                    <span className="detail-label">เที่ยวบิน:</span>
                    <span className="detail-value">{selectedBooking.returnFlightDetails.flightNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">สายการบิน:</span>
                    <span className="detail-value">{selectedBooking.returnFlightDetails.airline}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">เส้นทาง:</span>
                    <span className="detail-value">
                      {selectedBooking.returnFlightDetails.departureAirport} - {selectedBooking.returnFlightDetails.arrivalAirport}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">วันและเวลาออกเดินทาง:</span>
                    <span className="detail-value">{formatDate(selectedBooking.returnFlightDetails.departureTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">วันและเวลาถึง:</span>
                    <span className="detail-value">{formatDate(selectedBooking.returnFlightDetails.arrivalTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ระยะเวลาบิน:</span>
                    <span className="detail-value">{selectedBooking.returnFlightDetails.flightDuration}</span>
                  </div>
                </div>
              )}
              
              <div className="booking-detail-section">
                <h3>ข้อมูลผู้โดยสาร ({selectedBooking.passengers.length} คน)</h3>
                {selectedBooking.passengers.map((passenger, index) => (
                  <div key={index} className="passenger-details">
                    <div className="passenger-header">
                      <h4>ผู้โดยสารคนที่ {index + 1} ({passenger.type})</h4>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">ชื่อ-นามสกุล:</span>
                      <span className="detail-value">
                        {passenger.title} {passenger.firstName} {passenger.lastName}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">วันเกิด:</span>
                      <span className="detail-value">{formatDate(passenger.dateOfBirth).split(' ')[0]}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">สัญชาติ:</span>
                      <span className="detail-value">{passenger.nationality}</span>
                    </div>
                    {passenger.passportNumber && (
                      <>
                        <div className="detail-row">
                          <span className="detail-label">หมายเลขพาสปอร์ต:</span>
                          <span className="detail-value">{passenger.passportNumber}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">วันหมดอายุพาสปอร์ต:</span>
                          <span className="detail-value">{formatDate(passenger.passportExpiry).split(' ')[0]}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                ปิด
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteClick(selectedBooking)}
              >
                ลบการจอง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <div className="modal-header">
              <h2>ยืนยันการลบการจอง</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="confirmation-content">
              <p>
                คุณแน่ใจหรือไม่ว่าต้องการลบการจองรหัส{' '}
                <strong>{deleteConfirmation.bookingReference}</strong>?
              </p>
              <p className="warning">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            </div>
            
            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                ยกเลิก
              </button>
              <button
                type="button"
                className="delete-confirm-btn"
                onClick={handleDeleteBooking}
              >
                ลบการจอง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;