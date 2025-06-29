import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Header.css';

const Header = ({ onShowSignup }) => {
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="app-header">
      <nav className="nav-container">
        <div className="nav-brand">
          <a href="/">26Club</a>
        </div>
        
        <ul className="nav-links">
          <li><a href="/workouts">Workouts</a></li>
        </ul>
        
        <div className="nav-auth">
          {currentUser ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-name">{currentUser.name}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-info">
                    <p className="user-email">{currentUser.email}</p>
                  </div>
                  <button onClick={handleLogout} className="logout-button">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={onShowSignup} className="auth-btn signup-btn">
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
