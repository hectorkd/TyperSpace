import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import SocketIOCLient from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3001'; //TODO: keep in env

import './styles/Avatar.scss';

import blueRocket from '../../assets/icons/rocket1blue.png';
import yellowRocket from '../../assets/icons/rocket2yellow.png';
import orangeRocket from '../../assets/icons/rocket3orange.png';
import pinkRocket from '../../assets/icons/rocket4pink.png';
import violetRocket from '../../assets/icons/rocket5violet.png';

type Props = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
};

const Avatar: React.FC<Props> = (props) => {
  const history = useHistory();
  const { roomId } = useParams<Record<string, string | undefined>>();
  //console.log('roomid', roomId);
  const socketRef = useRef<SocketIOClient.Socket>();
  // const [socket, setSocket] = useState(useRef<SocketIOClient.Socket>());

  useEffect(() => {
    // const socketRef = useRef<SocketIOClient.Socket>();
    socketRef.current = SocketIOCLient(SOCKET_SERVER_URL, {
      query: { roomId },
    });
    props.setSocket(socketRef);
  }, [roomId]);

  //console.log('created socket', props.socket);

  function handleButtonClick(): void {
    //TODO: get input info about username and color
    //TODO: emit event userName
    props.socket.current.emit('userInfo', {
      userName: 'userName',
      color: 'red',
    });
    //go to lobby
    history.push({
      pathname: `/${roomId}/lobby`,
      // state: {socket: props.socket}
    });
  }

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
        <div className="avatar-list">
          <img src={blueRocket} className="avatar-images" />
          <img src={yellowRocket} className="avatar-images" />
          <img src={orangeRocket} className="avatar-images" />
          <img src={pinkRocket} className="avatar-images" />
          <img src={violetRocket} className="avatar-images" />
        </div>
      </div>
      <button className="btn-ready" onClick={handleButtonClick}>
        Ready
      </button>
    </div>
  );
};

export default Avatar;
