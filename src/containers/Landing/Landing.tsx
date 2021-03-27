import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Footer from '../../components/Footer/Footer';

import './styles/Landing.scss';

const Landing: React.FC = () => {
  const [isNewRaceClicked, setIsNewRaceClicked] = useState(false);
  const [isJoinRaceClicked, setIsJoinRaceClicked] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');

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
    setIsNewRaceClicked(true);
    const roomId = makeString();
    history.push(`/${roomId}`);
  }

  function handleJoinRaceClick(): void {
    setIsJoinRaceClicked(true);
    history.push(`/${inputRoomId}`);
  }

  function handleTextChange(e: any): void {
    e.preventDefault();
    setInputRoomId(e.target.value);
  }

  return (
    <div className="landing-bg-container">
      <h1 className="landing-main-title"> TyperSpace </h1>
      <div className="landing-buttons">
        <button
          onClick={handleNewRaceClick}
          className={
            isNewRaceClicked
              ? 'landing-buttons create-btn btn-press'
              : 'landing-buttons create-btn'
          }
        >
          New Race
        </button>
        <button
          className={
            isJoinRaceClicked
              ? 'landing-buttons join-btn btn-press'
              : 'landing-buttons join-btn'
          }
          onClick={() => {
            handleJoinRaceClick();
          }}
        >
          <p>Join Race</p>
          <input
            type="text"
            className="join-input"
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
