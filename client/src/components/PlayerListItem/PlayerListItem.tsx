import React from 'react';
import './styles/PlayerListItem.scss';
import rocket1 from '../../assets/icons/rocket1blue.png';

const PlayerListItem: React.FC = () => {
  return (
    <div>
      <li className="player-list-element-container">
        <div className="player-list name-element">Maylynn</div>
        <img src={rocket1} className="player-list avatar-element" />
        <div className="player-list status-element">Ready</div>
      </li>
    </div>
  );
};

export default PlayerListItem;
