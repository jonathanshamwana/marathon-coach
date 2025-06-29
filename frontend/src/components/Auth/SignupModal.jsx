import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModal.css';

const SignupModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call for waitlist signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show success and close modal
      alert('Thank you for joining the 26Club waitlist! We\'ll notify you when we launch.');
      onClose();
    } catch (error) {
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="auth-container">
          <h2>Join the 26Club Waitlist</h2>
          <p className="auth-subtitle">Be among the first to experience AI-powered marathon coaching</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Joining Waitlist...' : 'Join Waitlist'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>We'll notify you when 26Club launches!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal; 