import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import powerCardsObj from '../../assets/icons/powerCardsObj';

import './styles/PlayerListItem.scss';

import IPlayer from '../../interfaces/IPlayer';
// import rocket1 from '../../assets/icons/rocket1blue.png';

import rocketObj from '../../assets/icons/rocketObj';

type PlayerListItemProps = {
  player: IPlayer;
  socket: any;
};

const PlayerListItem: React.FC<PlayerListItemProps> = (props) => {
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
        <Droppable droppableId={props.player.userName}>
          {(provided: any, snapshot: any) => (
            <div
              className="player-applied-power-ups"
              {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
              style={{
                borderRadius: '10px',
                backgroundColor: snapshot.isDraggingOver
                  ? 'rgba(0, 0, 255, 0.1)'
                  : 'transparent',
              }}
            >
              {props.player.appliedPUs.map(({ id, powerUp }, index) => {
                return (
                  <Draggable
                    key={id}
                    draggableId={id}
                    index={index}
                    isDragDisabled={true}
                  >
                    {(provided: any) => (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                      >
                        <img
                          className="applied-power-ups"
                          src={powerCardsObj[powerUp]}
                        ></img>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="player-list status-element">
          {props.player.isReady ? 'Ready' : 'Not ready'}
        </div>
      </li>
    </div>
  );
};

export default PlayerListItem;
