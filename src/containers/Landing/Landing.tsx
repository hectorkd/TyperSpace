import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

import Footer from '../../components/Footer/Footer';

import './styles/Landing.scss';
import rocketObj from '../../assets/icons/rocketObj';

const Landing: React.FC = () => {
  const [newRaceBtnAnimationClass, setNewRaceBtnAnimationClass] = useState('');
  const [joinRaceBtnAnimationClass, setJoinRaceBtnAnimationClass] = useState(
    '',
  );
  const [inputRoomId, setInputRoomId] = useState('');
  const [allTheStars, setAllTheStars] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [randomUuid, setRandomUuid] = useState<string>();

  useEffect(() => {
    setRandomUuid(uuidv4());
  }, []);
  // console.log(randomUuid);

  const history = useHistory();
  //generate random string
  function makeString(): string {
    let outString = '';
    const inOptions = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      outString += inOptions.charAt(
        Math.floor(Math.random() * inOptions.length),
      );
    }
    return outString;
  }

  //generate random roomID and redirect to avatar page
  function handleNewRaceClick(): void {
    setNewRaceBtnAnimationClass('btn-press');
    const roomId = makeString();
    history.push(`/${roomId}`);
  }

  function handleJoinRaceClick(): void {
    if (inputRoomId.length === 6) {
      setJoinRaceBtnAnimationClass('btn-press');
      history.push(`/${inputRoomId}`);
    } else alert('Please enter a valid Race ID: e.g: q0yqdo');
  }

  function handleTextChange(e: any): void {
    e.preventDefault();
    setInputRoomId(e.target.value);
  }

  function handleJoinHover(): void {
    inputRef.current?.focus();
  }

  function handleKeyPress(e: any): void {
    if (e.charCode == 13) {
      return handleJoinRaceClick();
    }
  }
  // const starGenerator = () => {
  //   let starSize = `${Math.random() * 20 + 5}px`;
  //   return (
  //     <div
  //       className="single-star"
  //       style={{
  //         width: starSize,
  //         height: starSize,
  //         top: `${Math.random() * 720}px`,
  //         left: `${Math.random() * 1280}px`,
  //         transform: `rotate(${Math.random() * 180}deg)`,
  //         // animationDelay: `${Math.random() * 6}s`,
  //         // animationDuration: `${Math.random() * 3 + 1}s`,
  //       }}
  //     ></div>
  //   );
  // };

  // useEffect(() => {
  //   let starArray: Array<number> = [];

  //   for (let i = 0; i < 90; i++) {
  //     starArray.push(i);
  //   }

  //   setAllTheStars(
  //     starArray.map(() => {
  //       return starGenerator();
  //     })
  //   );

  // }, []);

  return (
    <TransitionGroup>
      <CSSTransition
        key={randomUuid}
        classNames={{ exit: 'slide-leave', exitActive: 'slide-leave-active' }}
        timeout={1000}
        appear
        on
      >
    <div className="landing-container">
      <div className="stars-layer"> </div>
      <div className="flying-rocket1">
        <img src={rocketObj['blueRocket']} />
        <div className="flying-rocket-1-flame-container">
          <div className="flying-rocket1-flame"></div>
        </div>
      </div>
      {/* {allTheStars.map((el) => {
        console.log(allTheStars);
        return <div className="single-star" style={el.props.style}></div>;
      })} */}
      <h1 className="landing-main-title"> TyperSpace </h1>
      <div className="landing-buttons">
        <button
          className={`landing-buttons create-btn ${newRaceBtnAnimationClass}`}
          onClick={() => handleNewRaceClick()}
        >
          New Race
        </button>
        <button
          className={`landing-buttons join-btn ${joinRaceBtnAnimationClass}`}
          onClick={() => {
            handleJoinRaceClick();
          }}
          onKeyPress={(e) => handleKeyPress(e)}
        >
          Join Race
          <input
            ref={inputRef}
            type="text"
            className="join-input"
            onMouseEnter={handleJoinHover}
            placeholder="tysp8s"
            value={inputRoomId}
            maxLength={6}
            spellCheck={false}
            onChange={handleTextChange}
          ></input>
        </button>
      </div>
      <Footer></Footer>
    </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
export default Landing;
