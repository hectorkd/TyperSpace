import React, { ReactNode, useEffect, useState } from 'react';
import IPlayer from '../../interfaces/Player';
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
  const testPlayers = [0, 1, 2, 3];
  const [players, setPlayers] = useState<IPlayer[]>([]);

  useEffect(() => {
    //get results
    props.socket.current.on('results', (players: IPlayer[]) => {
      console.log('received from server for room ', players);
      setPlayers(players);
    });
  }, []);

  return (
    <div className="results-bg-container">
      <div className="room-id-display-box">
        <h1 className="room-id-text">Room #4c2le3</h1>
      </div>
      <div className="results-display-box">
        {players.length > 0 ? (
          <div>
            <div className="winner-info-container">
              <div className="winner-info">
                <div className="wpm-display">
                  <h1 className="wpm-title">WPM:</h1>
                  <div className="wpm-container">
                    <h1 className="wpm-value">{players[0].gameData.WPM}</h1>
                  </div>
                </div>
                <div className="time-display">
                  <h1 className="time-title">Time:</h1>
                  <div className="time-container">
                    <h1 className="time-value">
                      {players[0].gameData.finishTime}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="winner-visual">
                <div className="winner-text">
                  <h3 className="winner:">Winner:</h3>
                  <h3 className="winner-name">{players[0].userName}</h3>
                </div>
                <div className="rocket-icon">
                  <img src={rocket2} className="winner-icon" />
                </div>
              </div>
            </div>
            <div className="placement-info-container">
              {testPlayers.map((element) => {
                return <PlayerPlacementItem key={element} />;
              })}
            </div>
          </div>
        ) : (
          <h1>No Data Yet</h1>
        )}
      </div>
    </div>
  );
};

export default Results;
