// src/components/UserInfo.jsx
import { useState, useEffect } from 'react';
import { fetchCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendar, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import '../styles/UserInfo.css';

const UserInfo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchCurrentUser();
        setUser(data);
      } catch (err) {
        navigate('/auth');
      }
    };

    loadUser();
  }, [navigate]);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const getUserDisplayName = () => {
    if (user.name) return user.name;
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserAvatar = () => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName())}&background=00f0ff&color=000814&size=200`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="user-info-page">
      <div className="user-info-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>

        <h2 className="page-title">User Profile</h2>

        <div className="profile-card">
          <div className="avatar-section">
            <img src={getUserAvatar()} alt="User Avatar" className="user-avatar-large" />
            <h3 className="user-name">{getUserDisplayName()}</h3>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div className="info-content">
                <label>Email Address</label>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaUser />
              </div>
              <div className="info-content">
                <label>User ID</label>
                <p className="user-id">{(user.id || user._id || '').toString().substring(0, 20)}...</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaCalendar />
              </div>
              <div className="info-content">
                <label>Account Created</label>
                <p>{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaCalendar />
              </div>
              <div className="info-content">
                <label>Last Sign In</label>
                <p>{formatDate(user.updatedAt || user.lastLogin)}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaShieldAlt />
              </div>
              <div className="info-content">
                <label>Email Verified</label>
                <p className={'verified'}>
                  Verified via app login
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaShieldAlt />
              </div>
              <div className="info-content">
                <label>Provider</label>
                <p>Email/Password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
