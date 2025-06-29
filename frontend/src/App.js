import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/General/Header';  
import Footer from './components/General/Footer';  
import Home from './pages/HomePage';  
import WorkoutLibraryPage from './pages/WorkoutLibraryPage';
import SignupModal from './components/Auth/SignupModal';
import './App.css';

function App() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header onShowSignup={() => setShowSignup(true)} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/workouts" element={<WorkoutLibraryPage />} />
            </Routes>
            <SignupModal 
              isOpen={showSignup} 
              onClose={() => setShowSignup(false)}
            />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
