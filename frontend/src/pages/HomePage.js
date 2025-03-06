import React, { useEffect, useContext } from 'react';
import Hero from '../components/home/Hero';
import SearchForm from '../components/home/SearchForm';
import PopularDestinations from '../components/home/PopularDestinations';
import { FlightContext } from '../contexts/FlightContext';
import './HomePage.css';

const HomePage = () => {
  const { getPopularRoutes, popularRoutes, loadingPopularRoutes } = useContext(FlightContext);

  useEffect(() => {
    // Fetch popular routes on component mount
    getPopularRoutes();
  }, []);

  return (
    <div className="home-page">
      <Hero />
      
      <section className="search-section">
        <div className="container">
          <SearchForm />
        </div>
      </section>
      
      <section className="popular-destinations-section">
        <div className="container">
          <h2 className="section-title">จุดหมายปลายทางยอดนิยม</h2>
          <p className="section-subtitle">ค้นพบโปรโมชั่นและเส้นทางยอดนิยมที่คุณสามารถเดินทางได้</p>
          
          <PopularDestinations 
            destinations={popularRoutes} 
            loading={loadingPopularRoutes} 
          />
        </div>
      </section>
      
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">ทำไมต้องเลือก GOWA FLY</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tag"></i>
              </div>
              <h3 className="feature-title">ราคาที่ดีที่สุด</h3>
              <p className="feature-description">
                ค้นพบราคาบัตรโดยสารที่ดีที่สุดและโปรโมชั่นพิเศษเพื่อการเดินทางที่คุ้มค่า
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-plane"></i>
              </div>
              <h3 className="feature-title">เที่ยวบินทั่วโลก</h3>
              <p className="feature-description">
                เข้าถึงสายการบินมากกว่า 500 สายการบินและจุดหมายปลายทางทั่วโลก
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3 className="feature-title">ชำระเงินที่ปลอดภัย</h3>
              <p className="feature-description">
                ระบบชำระเงินที่ปลอดภัยและหลากหลายช่องทางการชำระเงิน
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3 className="feature-title">บริการลูกค้า 24/7</h3>
              <p className="feature-description">
                ทีมงานบริการลูกค้าพร้อมให้ความช่วยเหลือตลอด 24 ชั่วโมง 7 วันต่อสัปดาห์
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">พร้อมที่จะเริ่มการเดินทางของคุณ?</h2>
            <p className="cta-text">
              สมัครสมาชิกเพื่อรับข้อเสนอพิเศษและโปรโมชั่นล่าสุด
            </p>
            <a href="/register" className="cta-button">
              สมัครสมาชิก
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;