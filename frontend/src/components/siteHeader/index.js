import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material'; // Profile icon from MUI
import '../../style.css'; 

const SiteHeader = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);

  return (
    <header className="site-header">
      <h1 className="logo">GAA Connect</h1>
      
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/createTeam" className="nav-link">Create Team</Link>
        
        {/* Teams Dropdown */}
        <div 
          className="teams-dropdown"
          onMouseEnter={() => setShowTeamsDropdown(true)}
          onMouseLeave={() => setShowTeamsDropdown(false)}
        >
          <span className="nav-link">Teams</span>
          {showTeamsDropdown && (
            <div className="dropdown-menu">
              <Link to="/addTeam">Add Team</Link>
              <Link to="/manageTeams">Manage Teams</Link>
            </div>
          )}
        </div>
        
        <Link to="/calendar" className="nav-link">Calendar</Link>

        {/* Settings / Profile Dropdown */}
        <div 
          className="user-profile"
          onMouseEnter={() => setShowSettings(true)}
          onMouseLeave={() => setShowSettings(false)}
        >
          <AccountCircle className="profile-icon" />
          {showSettings && (
            <div className="dropdown-menu">
              <Link to="/profile">Manage Account</Link>
              <Link to="/logout">Logout</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default SiteHeader;
