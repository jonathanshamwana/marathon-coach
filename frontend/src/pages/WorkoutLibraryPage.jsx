import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import workoutsData from '../data/workouts.json';
import WorkoutCard from '../components/Workouts/WorkoutCard';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

import '../styles/Home.css';
import '../styles/WorkoutLibrary.css';

function WorkoutLibraryPage() {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState(workoutsData);
  const [highlightedWorkout, setHighlightedWorkout] = useState(null);
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleShuffle = () => {
    const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)];
    setHighlightedWorkout(randomWorkout);

    setShowConfetti(true);

    setTimeout(() => {
        setShowConfetti(false);
    }, 5000);
  };

  // Show login prompt if user is not authenticated
  if (!currentUser) {
    return (
      <div className="home-container">
        <div className="animated-background"></div>
        <div className="auth-required-container">
          <h1 className="home-subheading patrick-hand-regular">Workout Library</h1>
          <div className="auth-required-content">
            <div className="auth-required-icon">🔒</div>
            <h2>Sign in to Access Workouts</h2>
            <p>Join 26Club to access our complete workout library and get personalized training plans.</p>
            <div className="auth-required-buttons">
              <button 
                onClick={() => window.location.href = '/'} 
                className="auth-required-btn primary"
              >
                Sign In
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="auth-required-btn secondary"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="animated-background"></div>
      <h1 className="home-subheading patrick-hand-regular">Workout Library</h1>
      <button onClick={handleShuffle} className="shuffle-button">🎲 Shuffle Workout</button>
      
      {showConfetti && 
      
        <Confetti
            width={width}
            height={height}
            numberOfPieces={500}
            gravity={0.2}
            recycle={false}
        />
      }

      {highlightedWorkout ? (
        <div className="highlighted-card-container">
          <WorkoutCard workout={highlightedWorkout} />
          <button className="back-button" onClick={() => setHighlightedWorkout(null)}>Back to All</button>
        </div>
      ) : (
        <div className="workout-grid">
          {workouts.map((workout, index) => (
            <WorkoutCard key={index} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutLibraryPage;
