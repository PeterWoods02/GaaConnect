import React from 'react';
import { useDrop } from 'react-dnd';

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
    ...style,
    position: 'absolute',
    width: 90,             
    height: 120,           
    cursor: 'default',
    transform: style?.transform,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}
>
  <div style={{ position: 'relative', width: '100%', height: 90 }}>
    <img
      src="/jersey.svg"
      alt="jersey"
      style={{
        width: '100%',
        height: '100%',
        opacity: assignedPlayer ? 1 : 0.3,
        filter: isOver ? 'drop-shadow(0 0 4px limegreen)' : 'none',
      }}
    />
    {assignedPlayer && (
      <div style={{
        position: 'absolute',
        top: '30%',
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 0 2px black',
        padding: '0 4px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {assignedPlayer.name}
      </div>
    )}
  </div>

  <div style={{
  fontSize: '10px',
  marginTop: 4,
  color: 'black',
  textAlign: 'center',
  whiteSpace: 'normal',         
  wordWrap: 'break-word',
  maxWidth: '100%',
  lineHeight: 1.1,
}}>
  {positionName}
</div>
</div>
  );
};

export default DropZone;
