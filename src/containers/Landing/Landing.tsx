import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Footer from '../../components/Footer/Footer';

import './styles/Landing.scss';

const Landing: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);
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
  function handleClick(): void {
    setIsClicked(true);
    const roomId = makeString();
    history.push(`/${roomId}/avatar`);
  }
  return (
    <div className="landing-bg-container">
      <h1 className="landing-main-title"> TyperSpace </h1>
      <div className="landing-buttons">
        <button
          onClick={handleClick}
          className={
            isClicked
              ? 'landing-buttons create-btn btn-press'
              : 'landing-buttons create-btn'
          }
        >
          Create Room
        </button>
        <button className="landing-buttons join-btn"> Join Room</button>
      </div>
      <Footer></Footer>
    </div>
  );
};
export default Landing;
