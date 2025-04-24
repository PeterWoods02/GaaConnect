import React, { useState } from 'react';
import DropZone from '../dropZones/index.js';
import theme from '../../assets/themes/theme.js';
import { updateTeamPositions } from '../../api/matchApi.js';
import { updateDefaultLineup } from '../../api/teamsApi.js';
import { useParams, useLocation, useNavigate  } from 'react-router-dom';
import { toast } from 'react-toastify';

const Pitch = ({ positions, setPositions, availablePlayers, setAvailablePlayers }) => {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const location = useLocation();
  const isDefaultMode = new URLSearchParams(location.search).get('default') === 'true';
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const teamId = user?.team?.[0];
  
  const positionDisplayNames = {
    Goalkeeper: "Goalkeeper",
    RightCornerBack: "Right Corner Back",
    FullBack: "Full Back",
    LeftCornerBack: "Left Corner Back",
    RightHalfBack: "Right Half Back",
    CentreHalfBack: "Centre Half Back",
    LeftHalfBack: "Left Half Back",
    Midfielder1: "Midfielder 1",
    Midfielder2: "Midfielder 2",
    RightHalfForward: "Right Half Forward",
    CentreHalfForward: "Centre Half Forward",
    LeftHalfForward: "Left Half Forward",
    RightCornerForward: "Right Corner Forward",
    FullForward: "Full Forward",
    LeftCornerForward: "Left Corner Forward",
  };

  const dropZoneStyles = {
    Goalkeeper: { top: '95%', left: '50%', transform: 'translate(-50%, -50%)' },
    RightCornerBack: { top: '85%', left: '75%', transform: 'translate(-50%, -50%)' },
    FullBack: { top: '85%', left: '50%', transform: 'translate(-50%, -50%)' },
    LeftCornerBack: { top: '85%', left: '25%', transform: 'translate(-50%, -50%)' },
    RightHalfBack: { top: '70%', left: '75%', transform: 'translate(-50%, -50%)' },
    CentreHalfBack: { top: '70%', left: '50%', transform: 'translate(-50%, -50%)' },
    LeftHalfBack: { top: '70%', left: '25%', transform: 'translate(-50%, -50%)' },
    Midfielder1: { top: '50%', left: '40%', transform: 'translate(-50%, -50%)' },
    Midfielder2: { top: '50%', left: '60%', transform: 'translate(-50%, -50%)' },
    RightHalfForward: { top: '30%', left: '75%', transform: 'translate(-50%, -50%)' },
    CentreHalfForward: { top: '30%', left: '50%', transform: 'translate(-50%, -50%)' },
    LeftHalfForward: { top: '30%', left: '25%', transform: 'translate(-50%, -50%)' },
    RightCornerForward: { top: '15%', left: '75%', transform: 'translate(-50%, -50%)' },
    FullForward: { top: '15%', left: '50%', transform: 'translate(-50%, -50%)' },
    LeftCornerForward: { top: '15%', left: '25%', transform: 'translate(-50%, -50%)' },
  };

  const handleDrop = (position, player) => {
    setPositions(prevPositions => {
      const updatedPositions = { ...prevPositions };
      let previousPosition = null;
  
      // remove player from their current pitch position
      for (const key in updatedPositions) {
        if (updatedPositions[key]?._id === player._id) {
          updatedPositions[key] = null;
          previousPosition = key;
        }
      }
  
      // return player to bench
      const displacedPlayer = updatedPositions[position];
      if (displacedPlayer && displacedPlayer._id !== player._id) {
        setAvailablePlayers(prev => [...prev, displacedPlayer]);
      }
      // assign player to new position
      updatedPositions[position] = player;
  
      return updatedPositions;
    });
    // remove player from bench 
    setAvailablePlayers(prev => prev.filter(p => p._id !== player._id));
  };
  
  
  

  // Handle save team button click
  const handleSaveTeam = async () => {
    try {
      if (isDefaultMode) {
        await updateDefaultLineup(teamId, positions);
        toast.success('✅ Default team lineup saved!');
      } else {
        await updateTeamPositions(matchId, positions);
        toast.success('✅ Match lineup saved!');
      }
      setTimeout(() => {
        navigate(`/manageteams/${teamId}`);
      }, 1500);
    } catch (error) {
      console.error('Error saving team:', error);
      toast.error('❌ Failed to save team.');
    }
  };

  return (
    <div
      style={{
        ...theme.customStyles.pitch.container,
        position: 'relative',
        width: '704px',
        height: '1024px',
      }}
    >
      <img
        src="/pitch.png"
        alt="Pitch"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />

      {Object.keys(positions).map((position) => (
        <DropZone
          key={position}
          position={position}
          positionName={positionDisplayNames[position]}
          assignedPlayer={positions[position]}
          onDrop={handleDrop}
          style={dropZoneStyles[position]}
        />
      ))}

      
      <button
        onClick={handleSaveTeam}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Save Team
      </button>
    </div>
  );
};

export default Pitch;
