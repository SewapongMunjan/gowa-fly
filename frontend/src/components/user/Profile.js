import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import EditProfile from './EditProfile';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword, error } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Clear messages when switching between edit modes
  useEffect(() => {
    setPasswordError('');
    setSuccessMessage('');
  }, [isEditing, showChangePassword]);
  
  // Handle password form input change
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle password update
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMessage('');
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    
    // Change password
    try {
      const result = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (result.success) {
        setSuccessMessage('เปลี่ยนรหัสผ่านสำเร็จ');
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(result.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }
    } catch (err) {
      setPasswordError('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    }
  };
  
  // Handle profile update
  const handleProfileUpdate = async (profileData) => {
    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setIsEditing(false);
        setSuccessMessage('อัปเดตข้อมูลสำเร็จ');
      } else {
        // Error is handled in the EditProfile component
      }
    } catch (err) {
      // Error is handled in the EditProfile component
    }
  };
  
  if (!user) {
    return <div className="loading-profile">กำลังโหลดข้อมูลผู้ใช้...</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>โปรไฟล์ของฉัน</h1>
        <div className="profile-actions">
          {!isEditing && !showChangePassword && (
            <>
              <button 
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                <i className="fas fa-edit"></i> แก้ไขโปรไฟล์
              </button>
              <button 
                className="change-password-btn"
                onClick={() => setShowChangePassword(true)}
              >
                <i className="fas fa-key"></i> เปลี่ยนรหัสผ่าน
              </button>
            </>
          )}
          {(isEditing || showChangePassword) && (
            <button 
              className="back-btn"
              onClick={() => {
                setIsEditing(false);
                setShowChangePassword(false);
              }}
            >
              <i className="fas fa-arrow-left"></i> กลับ
            </button>
          )}
        </div>
      </div>
      
      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i> {successMessage}
        </div>
      )}
      
      {error && !isEditing && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {!isEditing && !showChangePassword && (
        <div className="profile-details">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              <span>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
            </div>
          </div>
          
          <div className="profile-info">
            <div className="info-section">
              <h2>ข้อมูลส่วนตัว</h2>
              <div className="info-field">
                <span className="field-label">ชื่อ-นามสกุล:</span>
                <span className="field-value">{user.firstName} {user.lastName}</span>
              </div>
              <div className="info-field">
                <span className="field-label">อีเมล:</span>
                <span className="field-value">{user.email}</span>
              </div>
              <div className="info-field">
                <span className="field-label">เบอร์โทรศัพท์:</span>
                <span className="field-value">{user.phoneNumber}</span>
              </div>
              <div className="info-field">
                <span className="field-label">สถานะ:</span>
                <span className="field-value status">
                  {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป'}
                </span>
              </div>
            </div>
            
            <div className="info-section">
              <h2>ข้อมูลบัญชี</h2>
              <div className="info-field">
                <span className="field-label">สมัครสมาชิกเมื่อ:</span>
                <span className="field-value">
                  {new Date(user.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isEditing && (
        <EditProfile user={user} onUpdate={handleProfileUpdate} />
      )}
      
      {showChangePassword && (
        <div className="change-password-form">
          <h2>เปลี่ยนรหัสผ่าน</h2>
          
          {passwordError && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {passwordError}
            </div>
          )}
          
          <form onSubmit={handleSubmitPasswordChange}>
            <div className="form-group">
              <label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">รหัสผ่านใหม่</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                minLength="6"
                required
              />
              <small className="form-text">รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                minLength="6"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              เปลี่ยนรหัสผ่าน
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;