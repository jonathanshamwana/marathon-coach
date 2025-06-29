import React, { useState } from 'react';
import './WorkoutCard.css';

export default function WorkoutCard({ workout }) {
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleFlip = () => setFlipped(!flipped);
  const handleCheckbox = (e) => setCompleted(e.target.checked);

  return (
    <div className={`workout-card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="workout-card-inner">
        <div className="workout-card-front">
          <h3>{workout.name}</h3>
          <div className={`pill ${workout.type.toLowerCase()}`}>{workout.type}</div>
        </div>
        <div className="workout-card-back">
          <p>{workout.details}</p>
          <p><strong>Suggested Pace:</strong> {workout.suggested_pace}</p>
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={completed}
              onChange={handleCheckbox}
              onClick={(e) => e.stopPropagation()}
            />
            Done this before?
          </label>
        </div>
      </div>
    </div>
  );
}
