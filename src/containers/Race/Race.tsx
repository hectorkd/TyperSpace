import React, { ReactNode, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import IPositionData from '../../interfaces/IPositionData';
import useTypingGame from '../../useTypingGame';

import CountDown from '../../components/CountDown/CountDown';

// import blueRocket from '../../assets/icons/rocket1blue.png';
// import yellowRocket from '../../assets/icons/rocket2yellow.png';
// import orangeRocket from '../../assets/icons/rocket3orange.png';
// import pinkRocket from '../../assets/icons/rocket4pink.png';
// import violetRocket from '../../assets/icons/rocket5violet.png';

import './styles/Race.scss';

type RaceProps = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
};

type ahead = {
  player: string;
  idx: number;
};

const Race: React.FC<RaceProps> = (props) => {
  const { roomId } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  const [
    allPlayerCurrentIndex,
    setAllPlayerCurrentIndex,
  ] = useState<IPositionData>({});
  const [ahead, setAhead] = useState<ahead>({ player: '', idx: 0 });
  const [behind, setBehind] = useState<ahead>({ player: '', idx: 0 });
  const [start, setStart] = useState<number>();
  const [countDown, setCountDown] = useState<number>(0);

  const {
    states: {
      charsState,
      length,
      currIndex,
      correctChar,
      errorChar,
      phase,
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
    let newAhead = { player: '', idx: 0 };
    let newBehind = { player: '', idx: 0 };
    for (const player in allPlayerCurrentIndex) {
      if (
        player !== currPlayer &&
        allPlayerCurrentIndex[player] >= allPlayerCurrentIndex[currPlayer]
      ) {
        if (!newAhead.player || allPlayerCurrentIndex[player] < newAhead.idx) {
          newAhead = { player: player, idx: allPlayerCurrentIndex[player] };
        }
      }
      if (
        player !== currPlayer &&
        allPlayerCurrentIndex[player] < allPlayerCurrentIndex[currPlayer]
      ) {
        if (
          !newBehind.player ||
          allPlayerCurrentIndex[player] > newBehind.idx
        ) {
          newBehind = { player: player, idx: allPlayerCurrentIndex[player] };
        }
      }
    }
    setAhead(newAhead);
    setBehind(newBehind);
    console.log('ahead of me', ahead.player, ahead.idx);
    console.log('behind me', behind.player, behind.idx);
  }, [allPlayerCurrentIndex]);

  const handleKey = (key: any) => {
    if (key === 'Backspace') {
      deleteTyping(false);
    } else if (key.length === 1) {
      insertTyping(key, start);
    }
    props.socket.current.emit('position', {
      currIndex: currIndex,
    });
  };

  props.socket.current.on('positions', (data: IPositionData) => {
    setAllPlayerCurrentIndex(data);
  });

  function handleClickFinish(): void {
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
  //TODO: style countdown

  return (
    <div className="race-bg-container">
      {countDown > 0 ? (
        <div className="conditional-render">
          <div className="race-info-container left-side-bar">
            <div className="race-info-time">
              <CountDown countdown={countDown} />
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
            <button onClick={handleClickFinish} className="race-btn-finish">
              Finish Race
            </button>
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
  {
    /* <div className="race-info-container left-side-bar">
        <div className="race-info-time">
          <CountDown countdown={countDown} />
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
      </pre> */
  }
  {
    /* <button onClick={handleClickFinish} className="race-btn-finish">
          Finish Race
        </button>
      </div>
      <div className="race-info-container right-side-bar">
        <div className="race-info-leader-icon"> </div>
        <div className="race-info-leader-name"> </div>
      </div> */
  }
  {
    /* </div> */
  }
  {
    /* ); */
  }
};

export default Race;
