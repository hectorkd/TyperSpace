import React from 'react';
import './styles/PlayerListItem.scss';
import rocket1 from '../../assets/icons/rocket1blue.png';

const PlayerListItem: React.FC = () => {
  return (
    <div>
      <li className="player-list-element">
        <p className="player-name">Maylynn</p>{' '}
        <img src={rocket1} className="player-avatar-mid" /> <p>Ready</p>
      </li>
    </div>
  );
};

export default PlayerListItem;
