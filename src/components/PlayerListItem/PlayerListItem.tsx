import React from 'react';
import './styles/PlayerListItem.scss';

import IPlayer from '../../interfaces/IPlayer';
// import rocket1 from '../../assets/icons/rocket1blue.png';

import blueRocket from '../../assets/icons/rocket1blue.png';
import yellowRocket from '../../assets/icons/rocket2yellow.png';
import orangeRocket from '../../assets/icons/rocket3orange.png';
import pinkRocket from '../../assets/icons/rocket4pink.png';
import violetRocket from '../../assets/icons/rocket5violet.png';

type PlayerListItemProps = {
  // userName: string;
  // color: string;
  player: IPlayer;
};

const PlayerListItem: React.FC<PlayerListItemProps> = (props) => {
  const rocketObj: any = {
    blueRocket,
    yellowRocket,
    orangeRocket,
    pinkRocket,
    violetRocket,
  };

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
        {/* TODO: render applied power ups as list */}
        <div>{props.player.appliedPUs.scrambleWord ? 'Scramble' : 'False'}</div>
        <div>
          {props.player.appliedPUs.insertLongWord ? 'LongWord' : 'False'}
        </div>
        <div>{props.player.appliedPUs.insertSymbols ? 'Symbols' : 'False'}</div>
        <div className="player-list status-element">
          {props.player.isReady ? 'Ready' : 'Not ready'}
        </div>
      </li>
    </div>
  );
};

export default PlayerListItem;
