import React from 'react';
import './ErrorMessage.css';

export default function ErrorMessage(message) {
  return (
    <div className="coach-error">
      <span>{message}</span>
    </div>
  );
}
