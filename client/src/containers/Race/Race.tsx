import React, { ReactNode, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import IpositionData from '../../interfaces/positionData';

import useTypingGame from '../../useTypingGame';

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
    },
    actions: { insertTyping, deleteTyping },
  } = useTypingGame(props.text);

  useEffect(() => {
    console.log(positions);
  }, [positions]);

  props.socket.current.on('startTime', (startTime: number) => {
    console.log('received startTime! ', startTime);
    setStart(startTime);
  });

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
  });

  function handleClickFinish(): void {
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
      <button onClick={handleClickFinish}> Finish Race </button>
    </div>
  );
};

export default Race;
