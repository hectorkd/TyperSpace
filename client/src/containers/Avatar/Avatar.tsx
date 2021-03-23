import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import SocketIOCLient from 'socket.io-client';

import './styles/Avatar.scss';

interface MatchParams {
  roomId: string;
}

const SOCKET_SERVER_URL = 'http://localhost:3001';

const Avatar: React.FC<RouteComponentProps<MatchParams>> = (props) => {
  // const socketRef = useRef();
  const roomId = props.match.params.roomId;

  const socket = SocketIOCLient(SOCKET_SERVER_URL, {
    query: { roomId },
  });

  // socket.on('connection', () => {
  //   console.log(socket.id);
  // })

  console.log('created socket', socket);

  // console.log('created socket', socketRef);

  return (
    <div className="avatar-bg-container">
      <div className="room-id-input input">
        <label htmlFor="" className="input-label">
          enter room id
        </label>
        <input
          type="text"
          name=""
          id=""
          className="input-field room-id-input"
          value="room-id"
        />
      </div>
      <div className="name-field-input input">
        <label htmlFor="" className="input-label">
          enter name
        </label>
        <input type="text" name="" id="" className="input-field" />
      </div>
      <div className="avatar-container">
        <h2 className="avatar-select-h1">select colour</h2>
        <div className="avatar-selection"></div>
      </div>
      <button className="btn-ready">Ready</button>
    </div>
  );
};

export default Avatar;
