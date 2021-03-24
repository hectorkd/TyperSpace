import React, { ReactNode, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import IpositionData from '../../interfaces/positionData';

import useTypingGame from '../../useTypingGame';

import blueRocket from '../../assets/icons/rocket1blue.png';
import yellowRocket from '../../assets/icons/rocket2yellow.png';
import orangeRocket from '../../assets/icons/rocket3orange.png';
import pinkRocket from '../../assets/icons/rocket4pink.png';
import violetRocket from '../../assets/icons/rocket5violet.png';

import './styles/Race.scss';

type RaceProps = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
};

const Race: React.FC<RaceProps> = (props) => {
  const { roomId } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  const [positions, setPositions] = useState({});
  const [start, setStart] = useState<number>();
  const {
    states: {
      charsState,
      length,
      currIndex,
      currChar,
      correctChar,
      errorChar,
      phase,
      startTime,
      endTime,
      allKeyPresses,
    },
    actions: { insertTyping, deleteTyping },
  } = useTypingGame(props.text);

  // useEffect(() => {
  props.socket.current.on('startTime', (startTime: number) => {
    console.log('received startTime! ', startTime);
    setStart(startTime);
  });
  // }, [props.socket]);

  const handleKey = (key: any) => {
    if (key === 'Backspace') {
      deleteTyping(false);
    } else if (key.length === 1) {
      insertTyping(key, start);
      props.socket.current.emit('position', {
        currChar: currChar,
        currIndex: currIndex,
      });
    }
  };

  props.socket.current.on('positions', (data: IpositionData) => {
    setPositions(data);
    console.log(positions);
  });

  function handleClickFinish(): void {
    console.log({
      endTime,
      correctChar,
      errorChar,
      length,
    });
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

  //TODO: optimise font size to paragraph length

  return (
    <div className="race-bg-container">
      <div className="race-info-container left-side-bar">
        <div className="race-info-time"></div>
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
        {/* <pre>
        {JSON.stringify(
          {
            startTime,
            endTime,
            length,
            currIndex,
            currChar,
            correctChar,
            errorChar,
            phase,
            allKeyPresses,
          },
          null,
          2,
        )}
      </pre> */}
        <button onClick={handleClickFinish} className="race-btn-finish">
          Finish Race
        </button>
      </div>
      <div className="race-info-container right-side-bar">
        <div className="race-info-leader-icon"> </div>
        <div className="race-info-leader-name"> </div>
      </div>
    </div>
  );
};

export default Race;
