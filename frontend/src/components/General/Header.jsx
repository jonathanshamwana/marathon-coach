import React from 'react';
import '../../styles/Header.css'

function Header() { 

  return (
    <header className="app-header">
      <nav>
        <ul className="nav-links">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/">Training Log</a></li>
          <li><a href="/">Community</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;