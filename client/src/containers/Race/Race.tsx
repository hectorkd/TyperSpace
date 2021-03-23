import React, { ReactNode } from 'react';
import useTypingGame from '../../useTypingGame';

import './styles/Race.scss';

type Props = {
  socket: any, 
  setSocket: any,
  text: string,
  setText: any,
  children?: ReactNode
};

const Race: React.FC<Props> = (props) => {
  // const text = props.text;
  console.log(props.text);
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
      endTime
    },
    actions: { insertTyping, resetTyping, deleteTyping }
  } = useTypingGame(props.text);

  const handleKey = (key: any) => {
    console.log(key);
    if (key === "Escape") {
      // console.log('resetting game');
      resetTyping();
    } else if (key === "Backspace") {
      // console.log('deleting character');
      deleteTyping(false);
    } else if (key.length === 1) {
      // console.log('inserting key');
      insertTyping(key);
    }
  };

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
        {props.text.split("").map((char, index) => {
          const state = charsState[index];
          const color = state === 0 ? "black" : state === 1 ? "green" : "red";
          return (
            <span
              key={char + index}
              style={{ color }}
              className={currIndex + 1 === index ? "curr-letter" : ""}
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
            phase
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default Race;
