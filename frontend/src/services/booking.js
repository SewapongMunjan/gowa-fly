import api from './api';

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return { success: true, booking: response.data.booking };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างการจอง'
    };
  }
};

// Get user's bookings
export const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return { success: true, bookings: response.data.bookings };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง'
    };
  }
};

// Get booking details
export const getBookingDetails = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return { success: true, booking: response.data.booking };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงรายละเอียดการจอง'
    };
  }
};

// Get booking by reference number
export const getBookingByReference = async (referenceNumber) => {
  try {
    const response = await api.get(`/bookings/reference/${referenceNumber}`);
    return { success: true, booking: response.data.booking };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'ไม่พบข้อมูลการจองตามรหัสอ้างอิง'
    };
  }
};

// Update booking payment status
export const updateBookingPayment = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/payment`);
    return { success: true, booking: response.data.booking };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน'
    };
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return { success: true, booking: response.data.booking };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิกการจอง'
    };
  }
};