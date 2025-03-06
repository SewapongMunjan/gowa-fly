import React from 'react';
import BookingHistory from '../components/user/BookingHistory';
import './BookingHistoryPage.css';

const BookingHistoryPage = () => {
  return (
    <div className="booking-history-page">
      <div className="container">
        <BookingHistory />
      </div>
    </div>
  );
};

export default BookingHistoryPage;