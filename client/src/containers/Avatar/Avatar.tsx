import React, { useRef, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import SocketIOCLient from 'socket.io-client';
// import useSocket from '../../useSocket';

interface MatchParams {
  roomId: string;
}

const SOCKET_SERVER_URL = 'http://localhost:3001'; //TODO: keep in env

const Avatar: React.FC<RouteComponentProps<MatchParams>> = (props) => {

  // console.log('inside component with props', props);
  const roomId = props.match.params.roomId;
  const socketRef = useRef<SocketIOClient.Socket>();
  const [socket, setSocket] = useState(useRef<SocketIOClient.Socket>());

  useEffect(() => {
    // const socketRef = useRef<SocketIOClient.Socket>();
    socketRef.current = SocketIOCLient(SOCKET_SERVER_URL, {
      query: {roomId}
    });
    setSocket(socketRef);
  }, [roomId]);

  console.log('created socket', socket);

  return <div>Hello Avatar</div>;

};

export default Avatar;
