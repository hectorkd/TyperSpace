import React from 'react';
import PlayerListItem from '../PlayerListItem/PlayerListItem';
import './styles/PlayerList.scss';
import IPlayer from '../../interfaces/Player';

type PlayerListProps = {
  players: IPlayer[];
};

const PlayerList: React.FC<PlayerListProps> = (props) => {
  return (
    <ul className="player-list">
      {props.players.map((player: IPlayer, idx: number) => {
        return (
          <PlayerListItem
            key={idx}
            userName={player.userName}
            color={player.color}
          />
        );
      })}
    </ul>
  );
};

export default PlayerList;
