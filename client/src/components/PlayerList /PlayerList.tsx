import React from 'react';
import PlayerListItem from '../PlayerListItem/PlayerListItem';
import './styles/PlayerList.scss';

const PlayerList: React.FC = () => {
  return (
    <ul className="player-list">
      <PlayerListItem />
      <PlayerListItem />
      <PlayerListItem />
    </ul>
  );
};

export default PlayerList;
