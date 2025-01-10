import React, { useState } from 'react';
import DropZone from '../dropZones/index.js';
import theme from '../../assets/themes/theme.js';

const Pitch = () => {
  const [positions, setPositions] = useState({
    Goalkeeper: null,
    RightCornerBack: null,
    FullBack: null,
    LeftCornerBack: null,
    RightHalfBack: null,
    CentreHalfBack: null,
    LeftHalfBack: null,
    Midfielder1: null,
    Midfielder2: null,
    RightHalfForward: null,
    CentreHalfForward: null,
    LeftHalfForward: null,
    RightCornerForward: null,
    FullForward: null,
    LeftCornerForward: null,
  });

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
    setPositions((prev) => ({
      ...prev,
      [position]: player,
    }));
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
    </div>
  );
};

export default Pitch;
