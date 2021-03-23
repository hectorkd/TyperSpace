import React from 'react';
import PlayersList from '../../components/PlayerList /PlayerList';
import './styles/Lobby.scss';

const Lobby: React.FC = () => {
  return (
    <div className="lobby-bg-container">
      <div className="lobby-room-display-box"></div>
      <PlayersList />
    </div>
  );
};

export default Lobby;
