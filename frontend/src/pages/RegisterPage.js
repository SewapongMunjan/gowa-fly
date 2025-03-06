import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isAuthenticated, error } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Destructure form data
  const { firstName, lastName, email, password, confirmPassword, phoneNumber } = formData;
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber) {
      setFormError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      setFormError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setFormError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Register user
      const userData = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber
      };
      
      const result = await register(userData);
      
      if (result.success) {
        // Redirect to home page on successful registration
        navigate('/');
      } else {
        setFormError(result.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } catch (err) {
      setFormError('เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>สมัครสมาชิก</h1>
          <p>สร้างบัญชีใหม่เพื่อรับสิทธิประโยชน์พิเศษและโปรโมชั่นพิเศษ</p>
        </div>
        
        {(formError || error) && (
          <div className="register-error">
            <p>{formError || error}</p>
          </div>
        )}
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">ชื่อ</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                placeholder="กรอกชื่อของคุณ"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">นามสกุล</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                placeholder="กรอกนามสกุลของคุณ"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="กรอกอีเมลของคุณ"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">รหัสผ่าน</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                minLength="6"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="ยืนยันรหัสผ่านของคุณ"
                minLength="6"
                required
              />
            </div>
          </div>
          
          <div className="form-terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              ฉันยอมรับ <Link to="/terms-conditions">ข้อกำหนดและเงื่อนไข</Link> และ <Link to="/privacy-policy">นโยบายความเป็นส่วนตัว</Link>
            </label>
          </div>
          
          <div className="form-action">
            <button 
              type="submit" 
              className="register-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </button>
          </div>
        </form>
        
        <div className="register-footer">
          <p>
            มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;