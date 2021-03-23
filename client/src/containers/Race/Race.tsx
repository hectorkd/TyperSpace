import { STATUS_CODES } from 'node:http';
import React, { ReactNode } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import useTypingGame from '../../useTypingGame';

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

  return (
    <div>
      <h1>React Typing Game Hook Demo</h1>
      <p>Click on the text below and start typing (esc to reset)</p>
      <div
        className="typing-test"
        onKeyDown={(e) => {
          handleKey(e.key);
          e.preventDefault();
        }}
        tabIndex={0}
      >
        {props.text.split('').map((char, index) => {
          const state = charsState[index];
          const color = state === 0 ? 'black' : state === 1 ? 'green' : 'red';
          return (
            <span
              key={char + index}
              style={{ color }}
              className={currIndex + 1 === index ? 'curr-letter' : ''}
            >
              {char}
            </span>
          );
        })}
      </div>
      <pre>
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
      </pre>
      <button onClick={handleClick}> Finish Race </button>
    </div>
  );
};

export default Race;
