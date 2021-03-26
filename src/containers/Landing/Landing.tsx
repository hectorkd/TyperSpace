import React from 'react';
import { useHistory } from 'react-router-dom';

import Footer from '../../components/Footer/Footer';

import './styles/Landing.scss';

const Landing: React.FC = () => {
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
    const roomId = makeString();
    history.push(`/${roomId}`);
  }
  return (
    <div className="landing-bg-container">
      <h1 className="landing-main-title"> TyperSpace </h1>
      <div className="landing-buttons">
        <button onClick={handleClick} className=" landing-buttons create-btn">
          New Race
        </button>
        <button className="landing-buttons join-btn"> Join Race</button>
      </div>
      <Footer></Footer>
    </div>
  );
};
export default Landing;
