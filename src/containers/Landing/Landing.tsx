import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import Footer from '../../components/Footer/Footer';

import './styles/Landing.scss';

const Landing: React.FC = () => {
  const [newRaceBtnAnimationClass, setNewRaceBtnAnimationClass] = useState('');
  const [joinRaceBtnAnimationClass, setJoinRaceBtnAnimationClass] = useState(
    '',
  );
  const [inputRoomId, setInputRoomId] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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
    setTimeout(() => {
      history.push(`/${roomId}`);
    }, 400);
  }

  function handleJoinRaceClick(): void {
    if (inputRoomId.length === 6) {
      setJoinRaceBtnAnimationClass('btn-press');
      setTimeout(() => {
        history.push(`/${inputRoomId}`);
      }, 400);
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
  );
};
export default Landing;
