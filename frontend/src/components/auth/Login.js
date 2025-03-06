import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if there's a redirect path in location state
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Form validation
    if (!email || !password) {
      setFormError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect to the intended page or home
        navigate(from);
      } else {
        setFormError(result.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } catch (err) {
      setFormError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ โปรดลองอีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>เข้าสู่ระบบ</h2>
          <p>ยินดีต้อนรับกลับมา! กรุณาเข้าสู่ระบบเพื่อจัดการการจองและดูข้อมูลบัญชีของคุณ</p>
        </div>

        {formError && (
          <div className="login-error">
            <p>{formError}</p>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="กรอกอีเมลของคุณ"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านของคุณ"
              required
            />
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">ลืมรหัสผ่าน?</Link>
          </div>

          <div className="form-button">
            <button 
              type="submit" 
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>
            ยังไม่มีบัญชี? <Link to="/register" className="register-link">สมัครสมาชิก</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;