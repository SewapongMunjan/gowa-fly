import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import UserManagement from './UserManagement';
import BookingManagement from './BookingManagement';
import FlightManagement from './FlightManagement';
import Loader from '../../common/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.stats);
        setError(null);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Handle sidebar menu item click
  const handleMenuClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>แดชบอร์ดผู้ดูแล</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link 
                to="/admin" 
                className={window.location.pathname === '/admin' ? 'active' : ''}
                onClick={() => handleMenuClick('/admin')}
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>ภาพรวม</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className={window.location.pathname === '/admin/users' ? 'active' : ''}
                onClick={() => handleMenuClick('/admin/users')}
              >
                <i className="fas fa-users"></i>
                <span>จัดการผู้ใช้</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/bookings" 
                className={window.location.pathname === '/admin/bookings' ? 'active' : ''}
                onClick={() => handleMenuClick('/admin/bookings')}
              >
                <i className="fas fa-ticket-alt"></i>
                <span>จัดการการจอง</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/flights" 
                className={window.location.pathname === '/admin/flights' ? 'active' : ''}
                onClick={() => handleMenuClick('/admin/flights')}
              >
                <i className="fas fa-plane"></i>
                <span>จัดการเที่ยวบิน</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="fas fa-arrow-left"></i>
                <span>กลับสู่หน้าหลัก</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<AdminOverview stats={stats} />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/bookings" element={<BookingManagement />} />
          <Route path="/flights" element={<FlightManagement />} />
        </Routes>
      </div>
    </div>
  );
};

// Admin Overview Component (Dashboard Home)
const AdminOverview = ({ stats }) => {
  if (!stats) {
    return <div className="admin-error">ไม่สามารถโหลดข้อมูลสถิติได้</div>;
  }

  return (
    <div className="admin-overview">
      <h1>ภาพรวมระบบ</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon users">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>ผู้ใช้ทั้งหมด</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bookings">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="stat-info">
            <h3>การจองทั้งหมด</h3>
            <p className="stat-value">{stats.totalBookings}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="stat-info">
            <h3>รายได้ทั้งหมด</h3>
            <p className="stat-value">฿{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>รอการชำระเงิน</h3>
            <p className="stat-value">{stats.bookingStatusCounts.pendingPayment}</p>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stats-column">
          <div className="stats-card booking-status">
            <h3>สถานะการจอง</h3>
            <div className="booking-status-chart">
              <div className="chart-container">
                {/* Placeholder for chart - would be implemented with chart.js or similar */}
                <div className="booking-status-bars">
                  <div className="status-bar">
                    <div className="status-label">รอการชำระเงิน</div>
                    <div className="bar-container">
                      <div 
                        className="bar pending"
                        style={{ width: `${(stats.bookingStatusCounts.pendingPayment / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                    <div className="status-value">{stats.bookingStatusCounts.pendingPayment}</div>
                  </div>
                  <div className="status-bar">
                    <div className="status-label">ชำระเงินแล้ว</div>
                    <div className="bar-container">
                      <div 
                        className="bar paid"
                        style={{ width: `${(stats.bookingStatusCounts.paid / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                    <div className="status-value">{stats.bookingStatusCounts.paid}</div>
                  </div>
                  <div className="status-bar">
                    <div className="status-label">ยกเลิก</div>
                    <div className="bar-container">
                      <div 
                        className="bar cancelled"
                        style={{ width: `${(stats.bookingStatusCounts.cancelled / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                    <div className="status-value">{stats.bookingStatusCounts.cancelled}</div>
                  </div>
                  <div className="status-bar">
                    <div className="status-label">เสร็จสิ้น</div>
                    <div className="bar-container">
                      <div 
                        className="bar completed"
                        style={{ width: `${(stats.bookingStatusCounts.completed / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                    <div className="status-value">{stats.bookingStatusCounts.completed}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-column">
          <div className="stats-card recent-bookings">
            <h3>การจองล่าสุด</h3>
            {stats.recentBookings.length > 0 ? (
              <table className="recent-bookings-table">
                <thead>
                  <tr>
                    <th>รหัสอ้างอิง</th>
                    <th>ผู้ใช้</th>
                    <th>เส้นทาง</th>
                    <th>ราคา</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.bookingReference}</td>
                      <td>{booking.user.firstName} {booking.user.lastName}</td>
                      <td>{booking.flightDetails.departureAirport} - {booking.flightDetails.arrivalAirport}</td>
                      <td>฿{booking.totalPrice.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">ไม่มีข้อมูลการจองล่าสุด</p>
            )}
            
            <div className="view-all">
              <Link to="/admin/bookings">ดูทั้งหมด</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-card booking-trends">
        <h3>แนวโน้มการจอง (6 เดือนล่าสุด)</h3>
        {stats.bookingTrends.length > 0 ? (
          <div className="trends-chart">
            {/* Placeholder for trends chart - would be implemented with recharts or similar */}
            <div className="chart-placeholder">
              <div className="trend-bars">
                {stats.bookingTrends.map((month, index) => (
                  <div className="trend-bar-container" key={index}>
                    <div 
                      className="trend-bar"
                      style={{ 
                        height: `${(month.count / Math.max(...stats.bookingTrends.map(m => m.count))) * 100}%` 
                      }}
                    ></div>
                    <div className="trend-month">{`${month._id.month}/${month._id.year.toString().substr(2)}`}</div>
                    <div className="trend-value">{month.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="no-data">ไม่มีข้อมูลแนวโน้มการจอง</p>
        )}
      </div>
    </div>
  );
};