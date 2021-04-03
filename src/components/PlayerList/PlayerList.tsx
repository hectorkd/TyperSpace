import React from 'react';
import PlayerListItem from '../PlayerListItem/PlayerListItem';
import './styles/PlayerList.scss';
import IPlayer from '../../interfaces/IPlayer';

type PlayerListProps = {
  players: IPlayer[];
  socket: any;
};

const PlayerList: React.FC<PlayerListProps> = (props) => {
  return (
    <ul className="player-list">
      {props.players.map((player: IPlayer, idx: number) => {
        return (
          <PlayerListItem
            key={idx}
            player={player}
            socket={props.socket}
          />
        );
      })}
    </ul>
  );
};

export default PlayerList;
