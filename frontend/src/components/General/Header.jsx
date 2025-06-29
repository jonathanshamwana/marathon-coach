import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Header.css';

const Header = ({ onShowSignup }) => {
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <header className="app-header">
      <nav className="nav-container">
        <div className="nav-brand">
          <a href="/">26Club</a>
        </div>
        
        {/* Desktop Navigation */}
        <ul className="nav-links desktop-nav">
          <li><a href="/workouts">Workouts</a></li>
        </ul>
        
        <div className="nav-auth desktop-auth">
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

        {/* Mobile Hamburger Menu */}
        <div className="mobile-menu-container">
          <button 
            className="hamburger-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger-line ${showMobileMenu ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${showMobileMenu ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${showMobileMenu ? 'open' : ''}`}></span>
          </button>
          
          {showMobileMenu && (
            <div className="mobile-menu">
              <div className="mobile-menu-content">
                <a href="/workouts" onClick={closeMobileMenu} className="mobile-menu-link">
                  Workouts
                </a>
                {!currentUser && (
                  <button onClick={() => { onShowSignup(); closeMobileMenu(); }} className="mobile-menu-link mobile-waitlist-btn">
                    Join Waitlist
                  </button>
                )}
                {currentUser && (
                  <>
                    <div className="mobile-user-info">
                      <p className="mobile-user-name">{currentUser.name}</p>
                      <p className="mobile-user-email">{currentUser.email}</p>
                    </div>
                    <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="mobile-menu-link mobile-logout-btn">
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
