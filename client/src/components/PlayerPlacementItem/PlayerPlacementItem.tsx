import React from 'react';
import './styles/PlayerPlacementItem.scss';

const PlayerListItem: React.FC = () => {
  return (
    <div className="placement-container">
      <div className="placement-name-container">
        <div className="placement-place">
          <h3 className="finishing-place">2nd</h3>
        </div>
        <div className="placement-name">
          <h3 className="racer-name">Maria</h3>
        </div>
      </div>
      <div className="placement-wpm-container">
        <h3 className="placement-wpm">63</h3>
      </div>
      <div className="placement-time-container">
        <h3 className="placement-time">01:28</h3>
      </div>
    </div>
  );
};

export default PlayerListItem;
