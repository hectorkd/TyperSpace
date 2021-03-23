import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import SocketIOCLient from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3001'; //TODO: keep in env

type Props = {
  socket: any, 
  setSocket: any,
  text: string,
  setText: any, 
  children?: ReactNode
};

const Avatar: React.FC<Props> = (props) => {
  const history = useHistory();
  const { roomId } = useParams<Record<string, string | undefined>>();
  console.log('roomid', roomId);
  const socketRef = useRef<SocketIOClient.Socket>();
  // const [socket, setSocket] = useState(useRef<SocketIOClient.Socket>());

  useEffect(() => {
    // const socketRef = useRef<SocketIOClient.Socket>();
    socketRef.current = SocketIOCLient(SOCKET_SERVER_URL, {
      query: {roomId}
    });
    props.setSocket(socketRef);
  }, [roomId]);

  console.log('created socket', props.socket);

  function handleClick(): void {
    //TODO: get input info about username and color
    //TODO: emit event userName
    props.socket.current.emit('userInfo', {
      userName: 'userName',
      color: 'red'
    });
    //go to lobby
    history.push({
      pathname: `/${roomId}/lobby`,
      // state: {socket: props.socket}
    });
  }

  return (
    <div>
      <div>Hello Avatar</div>
      <button onClick={handleClick}> Click me </button>
    </div>
  );

};

export default Avatar;
