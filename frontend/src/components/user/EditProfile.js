import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import './EditProfile.css';

const EditProfile = ({ user, onUpdate }) => {
  const { error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form input change
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
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      setFormError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      setIsSubmitting(false);
      return;
    }
    
    // Validate phone number (simple validation)
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/[^0-9]/g, ''))) {
      setFormError('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await onUpdate(formData);
    } catch (err) {
      setFormError('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="edit-profile-container">
      <h2>แก้ไขข้อมูลส่วนตัว</h2>
      
      {(formError || error) && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {formError || error}
        </div>
      )}
      
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">ชื่อ</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
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
              value={formData.lastName}
              onChange={handleChange}
              placeholder="กรอกนามสกุลของคุณ"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">เบอร์โทรศัพท์</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
            required
          />
        </div>
        
        <div className="form-group email-display">
          <label>อีเมล</label>
          <div className="email-value">{user.email}</div>
          <small className="form-text">ไม่สามารถเปลี่ยนแปลงอีเมลได้</small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;