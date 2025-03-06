import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import logo from '../../assets/images/logo.png';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Gowa Fly" />
            <span>Gowa Fly</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className="navbar-toggle-icon"></span>
        </button>

        {/* Navigation links */}
        <nav className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-links">
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                หน้าแรก
              </Link>
            </li>
            <li>
              <Link to="/flights" onClick={() => setIsMenuOpen(false)}>
                ค้นหาเที่ยวบิน
              </Link>
            </li>
            <li>
              <Link to="/promotions" onClick={() => setIsMenuOpen(false)}>
                โปรโมชั่น
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                ติดต่อเรา
              </Link>
            </li>
          </ul>

          {/* User actions */}
          <div className="navbar-actions">
            {isAuthenticated() ? (
              <div className="navbar-user">
                <button className="navbar-user-toggle">
                  <span className="navbar-user-name">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="navbar-user-icon">▼</span>
                </button>

                <div className="navbar-dropdown">
                  <ul>
                    <li>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        โปรไฟล์
                      </Link>
                    </li>
                    <li>
                      <Link to="/bookings" onClick={() => setIsMenuOpen(false)}>
                        การจองของฉัน
                      </Link>
                    </li>
                    {isAdmin() && (
                      <li>
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                          แดชบอร์ดผู้ดูแลระบบ
                        </Link>
                      </li>
                    )}
                    <li>
                      <button onClick={handleLogout}>ออกจากระบบ</button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link 
                  to="/login" 
                  className="btn btn-outline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;