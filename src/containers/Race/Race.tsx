import React, {
  ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import IPositionData from '../../interfaces/IPositionData';
import useTypingGame from '../../useTypingGame';
import rocketObj from '../../assets/icons/rocketObj';
import helperFunctions from './raceHelperFunctions';
import IPlayer from '../../interfaces/IPlayer';

import CountDown from '../../components/CountDown/CountDown';

import './styles/Race.scss';

type RaceProps = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
  players: IPlayer[];
};

interface ahead {
  player: string;
  idx: number;
  color: string;
}

const Race: React.FC<RaceProps> = (props) => {
  const { roomId } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  const [
    allPlayerCurrentIndex,
    setAllPlayerCurrentIndex,
  ] = useState<IPositionData>({});
  const [ahead, setAhead] = useState<ahead>({ player: '', idx: 0, color: '' });
  const [behind, setBehind] = useState<ahead>({
    player: '',
    idx: 0,
    color: '',
  });
  const [start, setStart] = useState<number>();
  const [countDown, setCountDown] = useState<number>(-1);
  const [firstPlace, setFirstPlace] = useState<ahead>({
    player: '',
    idx: 0,
    color: '',
  });

  const aheadRef = useRef<HTMLElement>(null);
  const behindRef = useRef<HTMLElement>(null);

  const {
    states: {
      charsState,
      length,
      phase,
      currIndex,
      startTime,
      endTime,
      allKeyPresses,
    },
    actions: { insertTyping, deleteTyping },
  } = useTypingGame(props.text);

  useEffect(() => {
    props.socket.current.emit('position', { currIndex: undefined });
  }, []);

  useEffect(() => {
    props.socket.current.on('startTime', (startTime: number) => {
      console.log('received startTime! ', startTime);
      console.log('time diff', Math.round((startTime - Date.now()) / 1000));
      setStart(startTime);
      setCountDown(Math.round((startTime - Date.now()) / 1000));
    });

    helperFunctions.calculateRocketPositions(
      allPlayerCurrentIndex,
      setAhead,
      setBehind,
      props.socket.current.id,
    );

    helperFunctions.calculateFirstPlace(
      allPlayerCurrentIndex,
      setFirstPlace,
      props.players,
    );
  }, [allPlayerCurrentIndex]);

  console.log(aheadRef);

  //go to results page automatically
  useEffect(() => {
    if (phase === 2) {
      props.socket.current.emit('finishRace', {
        endTime: endTime,
        startTime: startTime,
        allKeyPresses: allKeyPresses,
        length: length,
      });
      history.push({
        pathname: `/${roomId}/results`,
      });
    }
  }, [phase]);

  const handleKey = (key: any) => {
    // handle key after countdown finished!
    if (countDown > 0) {
      return null;
    } else {
      if (key === 'Backspace') {
        deleteTyping(false);
      } else if (key.length === 1) {
        insertTyping(key, start);
      }
      props.socket.current.emit('position', {
        currIndex: currIndex,
      });
    }
  };

  const autoFocus = useCallback((el) => (el ? el.focus() : null), []);

  props.socket.current.on('positions', (data: IPositionData) => {
    setAllPlayerCurrentIndex(data);
  });

  //TODO: optimise font size to paragraph length
  //TODO: style countdown

  return (
    <div className="race-main-wrapper">
      <div className="race-radial-blur-bg"></div>
      <div className="race-bg-container">
        {countDown >= 0 ? (
          <div className="conditional-render">
            <div className="race-container">
              <div
                className="race-typing-test"
                onKeyDown={(e) => {
                  handleKey(e.key);
                  e.preventDefault();
                }}
                tabIndex={0}
                ref={autoFocus}
              >
                <div className="race-countdown-container">
                  <CountDown
                    countdown={countDown}
                    setCountDown={setCountDown}
                  />
                </div>

                {aheadRef?.current && (
                  <img
                    src={rocketObj[`${ahead.color}Rocket`]}
                    className="aheadRocket"
                    style={{
                      width: '35px',
                      height: '60px',
                      transform: 'rotate(90deg)',
                      position: 'absolute',
                      top: aheadRef.current.offsetTop - 50,
                      left: aheadRef.current.offsetLeft - 30,
                      zIndex: 5,
                    }}
                  />
                )}

                {behindRef?.current && (
                  <img
                    src={rocketObj[`${behind.color}Rocket`]}
                    className="behindRocket"
                    style={{
                      width: '35px',
                      height: '60px',
                      transform: 'rotate(90deg)',
                      position: 'absolute',
                      top: behindRef.current.offsetTop - 50,
                      left: behindRef.current.offsetLeft - 30,
                      zIndex: 5,
                    }}
                  />
                )}

                {props.text.split('').map((char, index) => {
                  const state = charsState[index];
                  const color =
                    state === 0
                      ? '#393939'
                      : state === 1
                      ? '#165b33'
                      : '#bb2528';
                  const charBgcolor =
                    state === 0
                      ? 'transparent'
                      : state === 1
                      ? '#92e6b5'
                      : '#e29b9c';
                  return (
                    <span
                      key={char + index}
                      ref={
                        ahead.player && ahead.idx + 2 === index
                          ? aheadRef
                          : behind.player && behind.idx + 2 === index
                          ? behindRef
                          : null
                      }
                      style={{
                        color,
                        backgroundColor: charBgcolor,
                        borderTop: '2px solid #808080',
                        borderRight: '2px solid #808080',
                        borderRadius: '6px',
                        minWidth: '20px,',
                      }}
                      className={currIndex + 1 === index ? 'curr-letter' : ''}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              {aheadRef?.current && (
                <svg
                  className="svg-horizontal-ahead"
                  style={{
                    top: aheadRef.current.offsetTop - 37,
                    left: 55,
                    width: '100%',
                    zIndex: 4,
                  }}
                >
                  <line
                    className="line-horizontal-ahead"
                    style={{ stroke: `${ahead.color}` }}
                    x1="0%"
                    y1="50%"
                    x2={aheadRef.current.offsetLeft - 35}
                    y2="50%"
                  ></line>
                </svg>
              )}
              {behindRef?.current && (
                <svg
                  className="svg-horizontal-behind"
                  style={{
                    top: behindRef.current.offsetTop - 37,
                    left: 48,
                    width: '100%',
                    zIndex: 4,
                  }}
                >
                  <line
                    className="line-horizontal-behind"
                    style={{ stroke: `${behind.color}` }}
                    x1="0%"
                    y1="50%"
                    x2={behindRef.current.offsetLeft - 35}
                    y2="50%"
                  ></line>
                </svg>
              )}

              {aheadRef?.current && (
                <svg
                  className="svg-vertical-ahead"
                  style={{
                    top: 155,
                    left: 43,
                    height: '100%',
                    width: 30,
                  }}
                >
                  <line
                    className="line-vertical-ahead"
                    style={{ stroke: `${ahead.color}` }}
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2={aheadRef.current.offsetTop - 177}
                  ></line>
                </svg>
              )}
              {behindRef.current && (
                <svg
                  className="svg-vertical-behind"
                  style={{
                    top: 155,
                    left: 35,
                    height: '100%',
                    width: 30,
                  }}
                >
                  <line
                    className="line-vertical-behind"
                    style={{ stroke: `${behind.color}` }}
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2={behindRef.current.offsetTop - 177}
                  ></line>
                </svg>
              )}
            </div>
            <div className="right-side-bar">
              <>
                {firstPlace.color ? (
                  <>
                    <h2 className="right-race-info-title">1st place</h2>
                    <div className="race-leader-info">
                      <img
                        className="race-leader-icon"
                        src={rocketObj[`${firstPlace?.color}Rocket`]}
                      />
                      <div className="race-leader-flame-container">
                        <div
                          className="race-leader-flame"
                          style={{ top: 250, left: -65 }}
                        ></div>
                      </div>
                      <h3
                        className="race-leader-name"
                        style={{
                          color: `${firstPlace?.color}`,
                        }}
                      >
                        {firstPlace.player ? firstPlace.player : ''}
                      </h3>
                    </div>
                  </>
                ) : (
                  <> </>
                )}{' '}
              </>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Race;
