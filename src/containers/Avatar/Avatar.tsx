import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import SocketIOCLient from 'socket.io-client';
import { FaCopy } from 'react-icons/fa';
import { GiCheckMark, GiCrossMark } from 'react-icons/gi';
import Slider from 'react-slick';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

const SOCKET_SERVER_URL = 'https://cryptic-fjord-92932.herokuapp.com/'; //TODO: keep in env
// const SOCKET_SERVER_URL = 'http://localhost:3001'; //TODO: keep in env

import rocketObj from '../../assets/icons/rocketObj';
import checkMarker from '../../assets/icons/checkMarker.svg';
import crossMarker from '../../assets/icons/crossMarker.svg';

import IPlayer from '../../interfaces/IPlayer';

import './styles/Avatar.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type AvatarProps = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
  players: any;
  setPlayers: any;
  rounds: number;
  setRounds: any;
  setCurrRound: any;
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
  const [opacity, setOpacity] = useState<number>(0.5);
  const [readyBtnAnimationClass, setReadyBtnAnimationClass] = useState('');
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
  const [randomUuid, setRandomUuid] = useState<string>();

  useEffect(() => {
    setRandomUuid(uuidv4());
  }, []);
  // console.log(randomUuid);

  const url = window.location.href;

  //Carousel selection options:
  const settings = {
    // dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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
      console.log('NEW SELECTED COLOR', { ...prevState, ...newSelectedColors });
      return { ...prevState, ...newSelectedColors };
    });
  }, [props.players]);

  function handleClickReady(): void {
    setReadyBtnAnimationClass('btn-press');
    //get useinfo from form and send to server
    props.socket.current.emit('userInfo', {
      userName: userName,
      color: selectedColor,
      rounds: props.rounds,
    });

    props.setCurrRound(1);
    //go to lobby

    setTimeout(() => {
      history.push({
        pathname: `/${roomId}/lobby`,
      });
    }, 400);
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
    <TransitionGroup>
      <CSSTransition
        key={randomUuid}
        classNames={{ enter: 'slide-enter', enterActive: 'slide-enter-active' }}
        timeout={1000}
        appear
      >
        <div className="avatar-bg-container">
          <div className="avatar-wrapper">
            <div className="avatar-input-container">
              <div className="room-id-input input">
                <label htmlFor="" className="input-label">
                  race id
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
                  spellCheck="false"
                  type="text"
                  value={userName}
                  maxLength={13}
                  onChange={(e) => setUserName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="name-field-input input">
                <label htmlFor="" className="input-label">
                  rounds
                </label>
                <input
                  spellCheck="false"
                  type="text"
                  value={props.rounds}
                  onChange={(e) => props.setRounds(e.target.value)}
                  name=""
                  id=""
                  className="input-field"
                />
              </div>
            </div>
            <div className="avatar-select-container">
              <h2 className="avatar-select-h1 ">select colour</h2>
              <div className="avatar-list">
                <Slider {...settings}>
                  {Object.keys(selectedColors).map((color, idx) => {
                    return (
                      <div key={idx} className="img-item-container">
                        <img
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
                          onClick={
                            selectedColors[color] ? undefined : handleClick
                          }
                        />
                        <img
                          src={checkMarker}
                          className={`${
                            selectedColor === color
                              ? 'check-mark'
                              : 'not-visible'
                          }`}
                        />
                        {/* <GiCheckMark
                      className={`${
                        selectedColor === color ? 'check-mark' : 'not-visible'
                      }`}
                    /> */}
                        <img
                          src={crossMarker}
                          className={`${
                            selectedColors[color] ? 'cross-mark' : 'not-visible'
                          }`}
                        />
                        {/* <GiCrossMark
                      className={`${
                        selectedColors[color] ? 'cross-mark' : 'not-visible'
                      }`}
                    /> */}
                      </div>
                    );
                  })}
                </Slider>
              </div>
              <button
                className={`btn-ready ${readyBtnAnimationClass}`}
                onClick={handleClickReady}
              >
                Ready
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Avatar;
