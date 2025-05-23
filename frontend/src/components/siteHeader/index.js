import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material'; // Profile icon from MUI
import '../../style.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';


const SiteHeader = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showPlayersDropdown, setShowPlayersDropdown] = useState(false);
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
  const [showFixturesDropdown, setShowFixturesDropdown] = useState(false);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };
  
  

  return (
    <header className="site-header">
      <h1 className="logo">GAA Connect</h1>
      
      <nav className="nav-links">
      {isAuthenticated && <Link to="/" className="nav-link">Home</Link>}

        {/* Players Dropdown */}
        {(user?.role === 'admin' || user?.role === 'coach' || user?.role === 'manager' || user?.role === 'player') && (
          <div 
            className="players-dropdown"
            onMouseEnter={() => setShowPlayersDropdown(true)}
            onMouseLeave={() => setShowPlayersDropdown(false)}
          >
            <span className="nav-link">Players</span>
            {showPlayersDropdown && (
              <div className="dropdown-menu">
                {(user?.role === 'admin' || user?.role === 'coach' || user?.role === 'manager') && (
                  <>
                    <Link to="/addPlayer">Add Player</Link>
                    <Link to="/searchPlayers">Search Player</Link>
                  </>
                )}
                <Link to="/playerStats">Player Stats</Link>
               </div>
            )}
          </div>
        )}

        {/* Teams Dropdown */}
        {(user?.role === 'admin' || user?.role === 'coach' || user?.role === 'manager') && (
          <div 
            className="teams-dropdown"
            onMouseEnter={() => setShowTeamsDropdown(true)}
            onMouseLeave={() => setShowTeamsDropdown(false)}
          >
            <span className="nav-link">Teams</span>
            {showTeamsDropdown && (
              <div className="dropdown-menu">
                <Link to="/addTeam">Add Team</Link>
                <Link to="/selectMatch">Create Team</Link>
                <Link to="/selectTeam">Manage Teams</Link>
                {user?.role === 'admin' && <Link to="/inviteManager">Invite Manager</Link>}
              </div>
            )}
          </div>
        )}

        {/* Calendar Dropdown */}
        {isAuthenticated && (
          <div 
            className="teams-dropdown"
            onMouseEnter={() => setShowFixturesDropdown(true)}
            onMouseLeave={() => setShowFixturesDropdown(false)}
          >
            <span className="nav-link">Fixtures</span>
            {showFixturesDropdown && (
              <div className="dropdown-menu">
                <Link to="/calendar">Calendar</Link>
                {(user?.role === 'admin' || user?.role === 'coach' || user?.role === 'manager') && (
                  <Link to="/addFixture">Add Fixture</Link>
                )}
                <Link to="/fanScorePage">Fan</Link>
              </div>
            )}
          </div>
        )}
        
        {/* Settings / Profile Dropdown */}
        <div 
          className="user-profile"
          onMouseEnter={() => setShowSettings(true)}
          onMouseLeave={() => setShowSettings(false)}
        >
          <AccountCircle className="profile-icon" />
          {showSettings && (
            <div className="dropdown-menu">
              <Link to="#" onClick={(e) => {
                e.preventDefault();
                handleProfileClick();
              }}>
                Manage Account
              </Link>
              <Link to="/contactAdmin">Contact Admin</Link>
              {isAuthenticated ? (
                <Link to="/" onClick={logout}>Logout</Link>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default SiteHeader;