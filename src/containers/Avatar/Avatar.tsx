import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import SocketIOCLient from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://cryptic-fjord-92932.herokuapp.com/'; //TODO: keep in env

import rocketObj from '../../assets/icons/rocketObj';

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
  const [userName, setUserName] = useState('');
  const [color, setColor] = useState('');
  useEffect(() => {
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

  //TODO: rocket selection: make it clear for user that he chose the rocket
  return (
    <div className="avatar-bg-container">
      <div className="room-id-input input">
        <label htmlFor="" className="input-label">
          Race #
        </label>
        <input
          type="text"
          disabled
          name=""
          id=""
          className="input-field room-id-input"
          value={roomId}
        />
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
            src={rocketObj.blueRocket}
            id="blue"
            className={`avatar-images ${color === 'blue' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={rocketObj.coralRocket}
            id="coral"
            className={`avatar-images ${color === 'coral' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={rocketObj.limeRocket}
            id="lime"
            className={`avatar-images ${color === 'lime' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={rocketObj.orangeRocket}
            id="orange"
            className={`avatar-images ${color === 'orange' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={rocketObj.pinkRocket}
            id="pink"
            className={`avatar-images ${color === 'pink' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={rocketObj.purpleRocket}
            id="purple"
            className={`avatar-images ${color === 'purple' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={rocketObj.redRocket}
            id="red"
            className={`avatar-images ${color === 'red' ? 'selected' : ''}`}
            onClick={handleClick}
          />
          <img
            src={rocketObj.tealRocket}
            id="teal"
            className={`avatar-images ${color === 'teal' ? 'selected' : ''}`}
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
