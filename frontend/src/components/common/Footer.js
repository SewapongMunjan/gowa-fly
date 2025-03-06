import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-title">เกี่ยวกับเรา</h3>
            <p className="footer-text">
              GOWA FLY เป็นแพลตฟอร์มการจองตั๋วเครื่องบินที่ให้บริการราคาที่ดีที่สุดและประสบการณ์การจองที่ราบรื่น ค้นหาเที่ยวบินที่เหมาะสมกับคุณที่สุดได้ที่นี่
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">สำรวจ</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">หน้าแรก</Link>
              </li>
              <li>
                <Link to="/flights">ค้นหาเที่ยวบิน</Link>
              </li>
              <li>
                <Link to="/promotions">โปรโมชั่น</Link>
              </li>
              <li>
                <Link to="/popular-routes">เส้นทางยอดนิยม</Link>
              </li>
              <li>
                <Link to="/travel-guide">แนะนำการเดินทาง</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">การช่วยเหลือ</h3>
            <ul className="footer-links">
              <li>
                <Link to="/faq">คำถามที่พบบ่อย</Link>
              </li>
              <li>
                <Link to="/booking-conditions">เงื่อนไขการจอง</Link>
              </li>
              <li>
                <Link to="/privacy-policy">นโยบายความเป็นส่วนตัว</Link>
              </li>
              <li>
                <Link to="/terms-conditions">ข้อกำหนดและเงื่อนไข</Link>
              </li>
              <li>
                <Link to="/contact">ติดต่อเรา</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">ติดต่อเรา</h3>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 ถนนสุขุมวิท กรุงเทพมหานคร 10110</span>
              </li>
              <li>
                <i className="fas fa-phone-alt"></i>
                <span>+66 2 123 4567</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>contact@gowafly.com</span>
              </li>
            </ul>
            <div className="footer-payment">
              <h4>วิธีการชำระเงิน</h4>
              <div className="footer-payment-icons">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amex"></i>
                <i className="fab fa-cc-paypal"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} GOWA FLY. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;