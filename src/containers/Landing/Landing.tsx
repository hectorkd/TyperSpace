import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

import Footer from '../../components/Footer/Footer';

import './styles/Landing.scss';

const Landing: React.FC = () => {
  const [newRaceBtnAnimationClass, setNewRaceBtnAnimationClass] = useState('');
  const [joinRaceBtnAnimationClass, setJoinRaceBtnAnimationClass] = useState(
    '',
  );
  const [inputRoomId, setInputRoomId] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [randomUuid, setRandomUuid] = useState(uuidv4());

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

  return (
    <div className="landing-container">
      <TransitionGroup>
        <CSSTransition key={randomUuid} classNames="slide" timeout={500} appear>
          <div>
            <h1 className="landing-main-title"> TyperSpace </h1>
            <div className="landing-buttons">
              <button
                className={`landing-buttons create-btn `}
                onClick={() => handleNewRaceClick()}
              >
                New Race
              </button>
              <button
                className={`landing-buttons join-btn `}
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
    </div>
  );
};
export default Landing;
