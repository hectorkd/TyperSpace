import React from 'react';
import './styles/PlayerListItem.scss';

import IPlayer from '../../interfaces/IPlayer';
// import rocket1 from '../../assets/icons/rocket1blue.png';

import rocketObj from '../../assets/icons/rocketObj';

type PlayerListItemProps = {
  // userName: string;
  // color: string;
  player: IPlayer;
  socket: any;
};

const PlayerListItem: React.FC<PlayerListItemProps> = (props) => {
  function handleCLick(e: any): void {
    const id = e.target.id;
    //TODO: decide on which event emit info to server
    //TODO: how to understand that power up is applied?
    props.socket.current.emit('applyPower', {
      power: id,
      userName: 'test',
    });
  }

  return (
    <div>
      <li className="player-list-element-container">
        <div
          className="player-list name-element"
          style={{ color: props.player.color }}
        >
          {props.player.userName}
        </div>
        <img
          src={rocketObj[`${props.player.color}Rocket`]}
          className="player-list avatar-element"
        />
        {/* TODO: render applied power ups as list? */}
        <div id="scramble" onClick={handleCLick}>
          {props.player.appliedPUs.scrambleWord ? 'Scramble' : 'False'}
        </div>
        <div id="longWord" onClick={handleCLick}>
          {props.player.appliedPUs.insertLongWord ? 'LongWord' : 'False'}
        </div>
        <div id="symbols" onClick={handleCLick}>
          {props.player.appliedPUs.insertSymbols ? 'Symbols' : 'False'}
        </div>
        <div className="player-list status-element">
          {props.player.isReady ? 'Ready' : 'Not ready'}
        </div>
      </li>
    </div>
  );
};

export default PlayerListItem;
