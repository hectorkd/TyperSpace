import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import SocketIOCLient from 'socket.io-client';

interface MatchParams {
  roomId: string;
}

const SOCKET_SERVER_URL = 'http://localhost:3001';

const Avatar: React.FC<RouteComponentProps<MatchParams>> = (props) => {
  // const socketRef = useRef();
  const roomId = props.match.params.roomId;

  const socket = SocketIOCLient(SOCKET_SERVER_URL, {
    query: {roomId}
  });

  // socket.on('connection', () => {
  //   console.log(socket.id);
  // })

  console.log('created socket', socket);

  // console.log('created socket', socketRef);

  return <div>Hello Avatar</div>;
};

export default Avatar;
