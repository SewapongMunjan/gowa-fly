import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <i className="fas fa-plane-slash"></i>
          </div>
          <h1>404</h1>
          <h2>ไม่พบหน้าที่คุณต้องการ</h2>
          <p>
            ขออภัย เราไม่สามารถค้นหาหน้าที่คุณกำลังมองหา
            หน้านี้อาจถูกลบไปแล้ว เปลี่ยนชื่อ หรือไม่สามารถใช้งานได้ชั่วคราว
          </p>
          <div className="not-found-actions">
            <Link to="/" className="home-btn">
              <i className="fas fa-home"></i> กลับสู่หน้าหลัก
            </Link>
            <Link to="/flights" className="search-btn">
              <i className="fas fa-search"></i> ค้นหาเที่ยวบิน
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;