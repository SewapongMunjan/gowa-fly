import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">ค้นหาเที่ยวบิน<br />ในราคาที่ดีที่สุด</h1>
        <p className="hero-subtitle">
          เปรียบเทียบและจองเที่ยวบินที่ถูกที่สุดไปยังจุดหมายปลายทางทั่วโลก
        </p>
      </div>
    </div>
  );
};

export default Hero;