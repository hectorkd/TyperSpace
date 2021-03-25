import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import IPositionData from '../../interfaces/IPositionData';
import useTypingGame from '../../useTypingGame';
import rocketObj from '../../assets/icons/rocketObj';

import CountDown from '../../components/CountDown/CountDown';
import gsap from 'gsap';

import './styles/Race.scss';
import IPlayer from '../../interfaces/IPlayer';

type RaceProps = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
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
  const [gamePhase, setGamePhase] = useState<number>(0);

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
    props.socket.current.on('startTime', (startTime: number) => {
      console.log('received startTime! ', startTime);
      console.log('time diff', Math.round((startTime - Date.now()) / 1000));
      setStart(startTime);
      setCountDown(Math.round((startTime - Date.now()) / 1000));
    });

    const currPlayer = props.socket.current.id;
    let newAhead = { player: '', idx: 0, color: '' };
    let newBehind = { player: '', idx: 0, color: '' };
    for (const player in allPlayerCurrentIndex) {
      if (
        allPlayerCurrentIndex[currPlayer] &&
        player !== currPlayer &&
        allPlayerCurrentIndex[player].currIndex >=
          allPlayerCurrentIndex[currPlayer].currIndex
      ) {
        if (
          !newAhead.player ||
          allPlayerCurrentIndex[player].currIndex < newAhead.idx
        ) {
          newAhead = {
            player: player,
            idx: allPlayerCurrentIndex[player].currIndex,
            color: allPlayerCurrentIndex[player].color,
          };
        }
      }
      if (
        allPlayerCurrentIndex[currPlayer] &&
        player !== currPlayer &&
        allPlayerCurrentIndex[player].currIndex <
          allPlayerCurrentIndex[currPlayer].currIndex
      ) {
        if (
          !newBehind.player ||
          allPlayerCurrentIndex[player].currIndex > newBehind.idx
        ) {
          newBehind = {
            player: player,
            idx: allPlayerCurrentIndex[player].currIndex,
            color: allPlayerCurrentIndex[player].color,
          };
        }
      }
    }
    setAhead(newAhead);
    setBehind(newBehind);
    gsap.to('.aheadRocket', {
      duration: 0.3,
      x: aheadRef.current ? aheadRef.current.offsetLeft : 0,
    });
    gsap.to('.behindRocket', {
      duration: 0.3,
      x: behindRef.current ? behindRef.current.offsetLeft : 0,
    });
  }, [allPlayerCurrentIndex]);

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

  props.socket.current.on('positions', (data: IPositionData) => {
    setAllPlayerCurrentIndex(data);
  });

  //TODO: optimise font size to paragraph length
  //TODO: style countdown

  return (
    <div className="race-bg-container">
      {countDown >= 0 ? (
        <div className="conditional-render">
          <div className="race-info-container left-side-bar">
            <div className="race-info-time">
              <CountDown countdown={countDown} setCountDown={setCountDown} />
            </div>
            <div className="race-info-wpm"></div>
          </div>
          <div className="race-container">
            <div
              className="race-typing-test"
              onKeyDown={(e) => {
                handleKey(e.key);
                e.preventDefault();
              }}
              tabIndex={0}
            >
              {aheadRef?.current && (
            <img
              src={rocketObj[`${ahead.color}Rocket`]}
              className="aheadRocket"
              style={{
                width: '35px',
                height: '60px',
                transform: 'rotate(90deg)',
                position: 'absolute',
                top: `${aheadRef.current.offsetTop - 47}px`,
                left: '-30px',
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
                top: `${behindRef.current.offsetTop - 47}px`,
                left: '-30px',
              }}
            />
          )}
              {props.text.split('').map((char, index) => {
                const state = charsState[index];
                const color =
                  state === 0 ? 'black' : state === 1 ? 'darkgreen' : 'red';
                const charBgcolor =
                  state === 0
                    ? 'transparent'
                    : state === 1
                    ? 'lightgreen'
                    : 'lightcoral';
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
                      borderTop: '1px solid lightgrey',
                      borderRight: '1px solid lightgrey',
                      borderRadius: '6px',
                    }}
                    className={currIndex + 1 === index ? 'curr-letter' : ''}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
            {/* <button onClick={handleClickFinish} className="race-btn-finish">
              Finish Race
            </button> */}
          </div>
          <div className="race-info-container right-side-bar">
            <div className="race-info-leader-icon"> </div>
            <div className="race-info-leader-name"> </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Race;
