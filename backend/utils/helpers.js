/**
 * Helper utility functions for the Gowa Fly application
 */

/**
 * Generate a random booking reference code
 * @param {number} length - Length of the reference code
 * @returns {string} - Random alphanumeric reference code
 */
const generateBookingReference = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  };
  
  /**
   * Format price in Thai Baht with thousands separator
   * @param {number} price - Price to format
   * @returns {string} - Formatted price with ฿ symbol
   */
  const formatPrice = (price) => {
    return `฿${price.toLocaleString('th-TH')}`;
  };
  
  /**
   * Calculate flight duration in human-readable format
   * @param {Date|string} departureTime - Departure time
   * @param {Date|string} arrivalTime - Arrival time
   * @returns {string} - Duration in format "Xh Ym"
   */
  const calculateFlightDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    
    // Duration in minutes
    const durationMinutes = Math.round((arrival - departure) / (1000 * 60));
    
    // Convert to hours and minutes
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}ชม. ${minutes}น.`;
  };
  
  /**
   * Format date to Thai locale
   * @param {Date|string} date - Date to format
   * @param {boolean} includeTime - Whether to include time
   * @returns {string} - Formatted date string
   */
  const formatThaiDate = (date, includeTime = false) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Date(date).toLocaleDateString('th-TH', options);
  };
  
  /**
   * Format time from date
   * @param {Date|string} date - Date to extract time from
   * @returns {string} - Formatted time (HH:MM)
   */
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  /**
   * Map flight status from English to Thai
   * @param {string} status - Flight status in English
   * @returns {string} - Flight status in Thai
   */
  const mapFlightStatus = (status) => {
    const statusMap = {
      'scheduled': 'จองแล้ว',
      'active': 'อยู่ระหว่างเดินทาง',
      'landed': 'ถึงที่หมายแล้ว',
      'cancelled': 'ยกเลิก',
      'incident': 'เกิดเหตุการณ์',
      'diverted': 'เปลี่ยนเส้นทาง',
      'delayed': 'ล่าช้า'
    };
    
    return statusMap[status] || 'ไม่ทราบสถานะ';
  };
  
  /**
   * Generate cabin class options in Thai
   * @returns {Array} - Array of cabin class options
   */
  const getCabinClassOptions = () => {
    return [
      { value: 'economy', label: 'ชั้นประหยัด' },
      { value: 'business', label: 'ชั้นธุรกิจ' },
      { value: 'first', label: 'ชั้นหนึ่ง' }
    ];
  };
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - Whether email is valid
   */
  const isValidEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate phone number format (Thai)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - Whether phone is valid
   */
  const isValidThaiPhone = (phone) => {
    // Basic Thai phone number validation (starts with 0, 10 digits)
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };
  
  module.exports = {
    generateBookingReference,
    formatPrice,
    calculateFlightDuration,
    formatThaiDate,
    formatTime,
    mapFlightStatus,
    getCabinClassOptions,
    isValidEmail,
    isValidThaiPhone
  };