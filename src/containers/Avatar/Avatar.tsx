import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import SocketIOCLient from 'socket.io-client';
import { FaCopy } from 'react-icons/fa';

const SOCKET_SERVER_URL = 'https://cryptic-fjord-92932.herokuapp.com/'; //TODO: keep in env

import blueRocket from '../../assets/icons/rocket1blue.png';
import yellowRocket from '../../assets/icons/rocket2yellow.png';
import orangeRocket from '../../assets/icons/rocket3orange.png';
import pinkRocket from '../../assets/icons/rocket4pink.png';
import violetRocket from '../../assets/icons/rocket5violet.png';

import './styles/Avatar.scss';

type AvatarProps = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
  players: any;
  setPlayers: any;
};

const Avatar: React.FC<AvatarProps> = (props) => {
  const history = useHistory();
  const { roomId } = useParams<Record<string, string | undefined>>();
  const socketRef = useRef<SocketIOClient.Socket>();
  const [userName, setUserName] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [opacity, setOpacity] = useState<number>(0.5);

  const url = window.location.href;

  useEffect(() => {
    console.log('url link', `${url}`);

    socketRef.current = SocketIOCLient(SOCKET_SERVER_URL, {
      query: { roomId },
    });
    console.log('connection to server!');
    props.setSocket(socketRef);
  }, [roomId]); //don't add props to array, useEffect runs twice when it's [props, roomId] and creates websocket twice

  function handleClickReady(): void {
    //get useinfo from form and send to server
    props.socket.current.emit('userInfo', {
      userName: userName,
      color: color,
    });
    //go to lobby
    history.push({
      pathname: `/${roomId}/lobby`,
    });
  }

  const handleClick = (e: any) => {
    const id = e.target.id;
    setColor(id);
  };

  function onCopy() {
    setOpacity(1);
    navigator.clipboard.writeText(`${url}`);
  }

  //TODO: rocket selection: make it clear for user that he chose the rocket
  return (
    <div className="avatar-bg-container">
      <div className="room-id-input input">
        <label htmlFor="" className="input-label">
          Race #
        </label>
        <div className="room-id-display">
          <div className="room-id-text">{roomId}</div>
          <button className="copy-button">
            <FaCopy
              className="copy-to-clipboard"
              size="40px"
              style={{ opacity: opacity }}
              onClick={onCopy}
            />
          </button>
        </div>
      </div>
      <div className="name-field-input input">
        <label htmlFor="" className="input-label">
          enter name
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          name=""
          id=""
          className="input-field"
        />
      </div>
      <div className="avatar-container">
        <h2 className="avatar-select-h1 ">select colour</h2>
        <div className="avatar-list">
          <img
            src={blueRocket}
            id="blue"
            className={`avatar-images ${color === 'blue' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={yellowRocket}
            id="yellow"
            className={`avatar-images ${color === 'yellow' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={orangeRocket}
            id="orange"
            className={`avatar-images ${color === 'orange' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={pinkRocket}
            id="pink"
            className={`avatar-images ${color === 'pink' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={violetRocket}
            id="violet"
            className={`avatar-images ${color === 'violet' ? 'selected' : ''}`}
            onClick={handleClick}
          />
        </div>
      </div>
      <button className="btn-ready" onClick={handleClickReady}>
        Ready
      </button>
    </div>
  );
};

export default Avatar;
