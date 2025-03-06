import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if there's a redirect path in location state
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

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
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>เข้าสู่ระบบ</h1>
          <p>ยินดีต้อนรับกลับมา! กรุณาเข้าสู่ระบบเพื่อจัดการการจองและดูข้อมูลบัญชีของคุณ</p>
        </div>

        {(formError || error) && (
          <div className="login-error">
            <p>{formError || error}</p>
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

          <div className="form-action">
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
            ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
          </p>
          <p>
            <Link to="/forgot-password">ลืมรหัสผ่าน?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;