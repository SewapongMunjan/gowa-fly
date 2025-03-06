import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Profile from '../components/user/Profile';
import Loader from '../components/common/Loader';
import './ProfilePage.css';

const ProfilePage = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated()) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <Loader />
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="container">
        <Profile />
      </div>
    </div>
  );
};

export default ProfilePage;