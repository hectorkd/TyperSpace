import React, { ReactNode } from 'react';
import rocket2 from '../../assets/icons/rocket2yellow.png';
import PlayerPlacementItem from '../../components/PlayerPlacementItem/PlayerPlacementItem';
import './styles/Results.scss';

type Props = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
};

const Results: React.FC<Props> = (props) => {
  const players = [0, 1, 2, 3];

  return (
    <div className="results-bg-container">
      <div className="room-id-display-box">
        <h1 className="room-id-text">Room #4c2le3</h1>
      </div>
      <div className="results-display-box">
        <div className="winner-info-container">
          <div className="winner-info">
            <div className="wpm-display">
              <h1 className="wpm-title">WPM:</h1>
              <div className="wpm-container">
                <h1 className="wpm-value">66</h1>
              </div>
            </div>
            <div className="time-display">
              <h1 className="time-title">Time:</h1>
              <div className="time-container">
                <h1 className="time-value">0.59</h1>
              </div>
            </div>
          </div>
          <div className="winner-visual">
            <div className="winner-text">
              <h3 className="winner:">Winner:</h3>
              <h3 className="winner-name">Maylynn</h3>
            </div>
            <div className="rocket-icon">
              <img src={rocket2} className="winner-icon" />
            </div>
          </div>
        </div>
        <div className="placement-info-container">
          {players.map((element) => {
            return <PlayerPlacementItem key={element} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Results;
