import React from 'react';
import { Link } from 'react-router-dom';
import '../../style.css'; 

const SiteHeader = () => {
  return (
    <header>
      <h1 className="logo">GAA Connect</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/players">Players</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/calender">Calender</Link>
      </nav>
    </header>
  );
};

export default SiteHeader;
