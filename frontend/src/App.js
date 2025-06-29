import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/General/Header';  
import Footer from './components/General/Footer';  
import Home from './pages/HomePage';  
import WorkoutLibraryPage from './pages/WorkoutLibraryPage';
import SignupModal from './components/Auth/SignupModal';

function App() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Header onShowSignup={() => setShowSignup(true)} />
        <main>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
