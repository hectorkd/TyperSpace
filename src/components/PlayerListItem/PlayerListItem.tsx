import React from 'react';
import './styles/PlayerListItem.scss';
// import rocket1 from '../../assets/icons/rocket1blue.png';

import rocketObj from '../../assets/icons/rocketObj';

type PlayerListItemProps = {
  userName: string;
  color: string;
};

const PlayerListItem: React.FC<PlayerListItemProps> = (props) => {
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
