import React, { ReactNode } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import useTypingGame from '../../useTypingGame';

import blueRocket from '../../assets/icons/rocket1blue.png';
import yellowRocket from '../../assets/icons/rocket2yellow.png';
import orangeRocket from '../../assets/icons/rocket3orange.png';
import pinkRocket from '../../assets/icons/rocket4pink.png';
import violetRocket from '../../assets/icons/rocket5violet.png';

import './styles/Race.scss';

type Props = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
};

const Race: React.FC<Props> = (props) => {
  // const text = props.text;
  const { roomId } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  // console.log(props.text);

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
    },
    actions: { insertTyping, deleteTyping },
  } = useTypingGame(props.text);

  props.socket.current.on('startTime', (startTime: number) => {
    console.log('time right now', Date.now());
    console.log('received startTime! ', startTime);
  });

  const handleKey = (key: any) => {
    // console.log(key);
    //don't need to reset game during race
    // if (key === "Escape") {
    //   // console.log('resetting game');
    //   resetTyping();
    if (key === 'Backspace') {
      // console.log('deleting character');
      deleteTyping(false);
      props.socket.current.emit('position', {
        currChar: currChar,
        currIndex: currIndex,
      });
    } else if (key.length === 1) {
      // console.log('inserting key');
      insertTyping(key);
      props.socket.current.emit('position', {
        currChar: currChar,
        currIndex: currIndex,
      });
    }
  };

  props.socket.current.on('positions', (msg: any) => {
    console.log(msg);
  });

  function handleClick(): void {
    console.log({
      endTime,
      correctChar,
      errorChar,
    });
    props.socket.current.emit('finishRace', {
      endTime: endTime,
      correctChar: correctChar,
      errorChar: errorChar,
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
          },
          null,
          2,
        )}
      </pre> */}
        <button onClick={handleClick} className="race-btn-finish">
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
