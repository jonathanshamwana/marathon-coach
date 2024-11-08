import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/General/Header';  
import Footer from './components/General/Footer';  
import Home from './pages/Home';  

function App() {
    return (
      <Router>
        <Header />
        <main>
        <Routes>
              <Route path="/" element={<Home />} /> 
            </Routes>
        </main>
        <Footer />
      </Router>
    );
  }

export default App;
