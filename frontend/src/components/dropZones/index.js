import React from 'react';
import { useDrop } from 'react-dnd';
import theme from '../../assets/themes/theme.js';

const DropZone = ({ position, positionName, onDrop, assignedPlayer, style }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PLAYER',
    drop: (item) => onDrop(position, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        ...style, // merge style from pitch
        ...theme.customStyles.pitch.dropZone, 
        backgroundColor: isOver ? 'lightgreen' : 'transparent',
        border: '1px dashed #000',
        textAlign: 'center',
        lineHeight: '100px',
        position: 'absolute',
      }}
      >
      {assignedPlayer ? (
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          {assignedPlayer.name} 
        </div>
      ) : (
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          {positionName} 
        </div>
      )}
    </div>
  );
};

export default DropZone;
