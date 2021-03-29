import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import SocketIOCLient from 'socket.io-client';
import { FaCopy } from 'react-icons/fa';

// const SOCKET_SERVER_URL = 'https://cryptic-fjord-92932.herokuapp.com/'; //TODO: keep in env
const SOCKET_SERVER_URL = 'http://localhost:3001'; //TODO: keep in env

import rocketObj from '../../assets/icons/rocketObj';

import './styles/Avatar.scss';
import IPlayer from '../../interfaces/IPlayer';
import { isConstructorDeclaration } from 'typescript';

type AvatarProps = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
  players: any;
  setPlayers: any;
};

interface colorState {
  [color: string]: boolean;
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const history = useHistory();
  const { roomId } = useParams<Record<string, string | undefined>>();
  const socketRef = useRef<SocketIOClient.Socket>();
  const [userName, setUserName] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [rounds, setRounds] = useState<string>('');
  const [opacity, setOpacity] = useState<number>(0.5);
  //const [pla]

  const [selectedColors, setSelectedColors] = useState<colorState>({
    blue: false,
    coral: false,
    lime: false,
    orange: false,
    pink: false,
    purple: false,
    red: false,
    teal: false,
  });

  const url = window.location.href;

  useEffect(() => {
    socketRef.current = SocketIOCLient(SOCKET_SERVER_URL, {
      query: { roomId },
    });
    console.log('connection to server!');
    props.setSocket(socketRef);
  }, [roomId]); //don't add props to array, useEffect runs twice when it's [props, roomId] and creates websocket twice

  useEffect(() => {
    const newSelectedColors: colorState = {
      blue: false,
      coral: false,
      lime: false,
      orange: false,
      pink: false,
      purple: false,
      red: false,
      teal: false,
    };
    for (const player of props.players) {
      if (player.color) {
        newSelectedColors[player.color] = true;
      }
    }
    setSelectedColors((prevState) => {
      console.log({ ...prevState, ...newSelectedColors });
      return { ...prevState, ...newSelectedColors };
    });
  }, [props.players]);

  function handleClickReady(): void {
    //get useinfo from form and send to server
    props.socket.current.emit('userInfo', {
      userName: userName,
      color: selectedColor,
      rounds: rounds,
    });
    //go to lobby
    history.push({
      pathname: `/${roomId}/lobby`,
    });
  }

  const handleClick = (e: any) => {
    const id = e.target.id;
    setSelectedColor(id);
  };

  function onCopy() {
    setOpacity(1);
    navigator.clipboard.writeText(`${url}`);
  }

  props.socket
    ? props.socket.current.on('playerInfo', (data: IPlayer[]) => {
        props.setPlayers(data);
      })
    : null;

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
          maxLength={13}
          onChange={(e) => setUserName(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="name-field-input input">
        <label htmlFor="" className="input-label">
          number of rounds
        </label>
        <input
          type="text"
          value={rounds}
          onChange={(e) => setRounds(e.target.value)}
          name=""
          id=""
          className="input-field"
        />
      </div>
      <div className="avatar-container">
        <h2 className="avatar-select-h1 ">select colour</h2>
        <div className="avatar-list">
          {Object.keys(selectedColors).map((color, idx) => {
            return (
              <img
                key={idx}
                id={color}
                src={rocketObj[`${color}Rocket`]}
                className={`avatar-images ${
                  selectedColors[color]
                    ? 'taken'
                    : selectedColor === color
                    ? 'selected'
                    : ''
                }`}
                alt=""
                onClick={selectedColors[color] ? undefined : handleClick}
              />
            );
          })}
        </div>
      </div>
      <button className="btn-ready" onClick={handleClickReady}>
        Ready
      </button>
    </div>
  );
};

export default Avatar;
