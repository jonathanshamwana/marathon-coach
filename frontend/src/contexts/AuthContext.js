import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('26club_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // For now, we'll use a simple mock authentication
      // In production, this would call your backend API
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0], // Use email prefix as name
        createdAt: new Date().toISOString()
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('26club_user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      // For now, we'll use a simple mock registration
      // In production, this would call your backend API
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        name: name,
        createdAt: new Date().toISOString()
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('26club_user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('26club_user');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 