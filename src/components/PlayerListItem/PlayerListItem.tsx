import React from 'react';
import './styles/PlayerListItem.scss';
// import rocket1 from '../../assets/icons/rocket1blue.png';

import blueRocket from '../../assets/icons/rocket1blue.png';
import yellowRocket from '../../assets/icons/rocket2yellow.png';
import orangeRocket from '../../assets/icons/rocket3orange.png';
import pinkRocket from '../../assets/icons/rocket4pink.png';
import violetRocket from '../../assets/icons/rocket5violet.png';

type PlayerListItemProps = {
  userName: string;
  color: string;
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
          style={{ color: props.color }}
        >
          {props.userName}
        </div>
        <img
          src={rocketObj[`${props.color}Rocket`]}
          className="player-list avatar-element"
        />
        <div className="player-list status-element">Ready</div>
      </li>
    </div>
  );
};

export default PlayerListItem;
