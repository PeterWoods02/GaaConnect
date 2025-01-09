import React from 'react';

const Pitch = () => {
    return (
      <div
        style={{
        position: 'relative',
        width: '704px',  
        height: '1024px',
        backgroundImage: `url(/pitch.png)`,
        backgroundSize: 'contain', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', 
        border: '1px solid #ccc', 
        borderRadius: '10px', 
      }}
    >
      {/* add players other features here */}
    </div>
  );
};

export default Pitch;