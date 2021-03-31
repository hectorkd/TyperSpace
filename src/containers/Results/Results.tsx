import React, { ReactNode, useEffect, useState } from 'react';
import IPlayer from '../../interfaces/IPlayer';
import rocketObj from '../../assets/icons/rocketObj';
import PlayerPlacementItem from '../../components/PlayerPlacementItem/PlayerPlacementItem';
import './styles/Results.scss';
import sortResult from './resultsHelperFunctions';

import { useParams, useHistory } from 'react-router-dom';

type Props = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
  players: IPlayer[];
  setPlayers: React.Dispatch<React.SetStateAction<IPlayer[]>>;
  final: boolean;
  setFinal: any;
  rounds: number;
  setRounds: any;
  currRound: number;
  setCurrRound: any;
};

const Results: React.FC<Props> = (props) => {
  const { roomId } = useParams<Record<string, string | undefined>>();
  const [isAllFinished, setIsAllFinished] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const player = props.players.filter(
      (player) => player.userId === props.socket.current.id,
    );
    setIsHost(player[0].isHost);
  }, []);

  useEffect(() => {
    props.socket.current.on('results', (players: IPlayer[]) => {
      console.log('received from server for room ', players);
      const sortedPlayers = sortResult(players, props.final);
      if (
        players.every((player) => {
          return player.gameData.WPM;
        })
      ) {
        setIsAllFinished(true);
      }

      props.setPlayers(sortedPlayers);
    });

    props.socket.current.on(
      'getGameState',
      (rounds: number, currRound: number) => {
        props.setRounds(rounds);
        props.setCurrRound(currRound);
      },
    );
  }, [props.players]);

  function handlePlayAgainClick() {
    props.socket.current.emit('playAgain');
    history.push({
      pathname: `/${roomId}/lobby`,
    });
    props.socket.current.emit('getParagraph');
  }

  function handleNextRoundClick() {
    props.socket.current.emit('nextRound');
    history.push({
      pathname: `/${roomId}/lobby`,
    });
  }

  function handleFinalResultsClick() {
    props.socket.current.emit('sendToFinal');
    history.push({
      pathname: `/${roomId}/final`,
    });
  }

  props.socket.current.on('navigateToFinal', () => {
    props.setFinal(true);
    props.setPlayers(sortResult(props.players, props.final));
    history.push({
      pathname: `/${roomId}/final`,
    });
    setIsAllFinished(true);
  });

  props.socket.current.on('navigateToLobby', () => {
    props.setCurrRound(props.currRound + 1);
    history.push({
      pathname: `/${roomId}/lobby`,
    });
  });

  return (
    <div className="results-bg-container">
      <div className="room-id-display-box">
        {props.rounds ? (
          <h1 className="room-id-text">
            Round {props.currRound} of {props.rounds}
          </h1>
        ) : (
          <h1 className="room-id-text">Race #{roomId}</h1>
        )}
      </div>
      <div className="results-display-box">
        {props.players.length > 0 ? (
          <div className="inside-results-display">
            <div className="winner-info-container">
              <div className="winner-picture">
                <div className="name-container">
                  <h3 className="winner-text">Winner:</h3>
                  <h3
                    className="winner-name"
                    style={{ color: props.players[0].color }}
                  >
                    {props.players[0].userName}
                  </h3>
                </div>
                <div className="rocket-icon">
                  <img
                    src={rocketObj[`${props.players[0].color}Rocket`]}
                    className="winner-icon"
                  />
                </div>
              </div>
              <div className="winner-info">
                <div className="winner-wpm-container">
                  <h1 className="wpm-title">WPM:</h1>
                  <div className="wpm-container">
                    <h1 className="wpm-value">
                      {props.final
                        ? props.players[0].WPMAverage
                        : props.players[0].gameData.WPM}
                    </h1>
                  </div>
                </div>
                {props.final ? null : (
                  <div className="accuracy-container">
                    <h1 className="accuracy-title">Accuracy:</h1>
                    <div className="accuracy-container-box">
                      <h1 className="accuracy-value">
                        {props.players[0].gameData.accuracy}%
                      </h1>
                    </div>
                  </div>
                )}
                {props.final ? null : (
                  <div className="time-container">
                    <h1 className="time-title">Time:</h1>
                    <div className="time-container-box">
                      <h1 className="time-value">
                        {props.players[0].gameData.finishTime}
                      </h1>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="placement-info-container">
              <div className="table-header">
                <h3>Place</h3>
                <h3>Player</h3>
                <h3>WPM</h3>
                {props.final ? null : <h3>Accuracy</h3>}
                {props.final ? null : <h3>Time</h3>}
              </div>
              <div className="scroll-container">
                <div className="scroll-area">
                  {props.players.slice(1).map((element) => {
                    return (
                      <PlayerPlacementItem
                        key={element.userName}
                        name={element.userName}
                        rocketColor={element.color}
                        gameData={element.gameData}
                        rank={props.players.indexOf(element) + 1}
                        WPMAverage={element.WPMAverage}
                        final={props.final}
                      />
                    );
                  })}
                </div>
              </div>
              {props.rounds && props.currRound !== props.rounds ? (
                <button
                  disabled={!isHost || !isAllFinished}
                  onClick={handleNextRoundClick}
                  className={
                    isHost && isAllFinished
                      ? 'lobby-btn-start'
                      : 'lobby-btn-start-disabled'
                  }
                >
                  {' '}
                  Next Round{' '}
                </button>
              ) : props.rounds && props.currRound === props.rounds ? (
                <button
                  disabled={!isHost || !isAllFinished}
                  onClick={handleFinalResultsClick}
                  className={
                    isHost && isAllFinished
                      ? 'lobby-btn-start'
                      : 'lobby-btn-start-disabled'
                  }
                >
                  {' '}
                  Final Results{' '}
                </button>
              ) : (
                <button
                  disabled={!isHost || !isAllFinished}
                  onClick={handlePlayAgainClick}
                  className={
                    isHost && isAllFinished
                      ? 'lobby-btn-start'
                      : 'lobby-btn-start-disabled'
                  }
                >
                  {' '}
                  Play Again{' '}
                </button>
              )}
            </div>
          </div>
        ) : (
          <h1>No ones finished the race yet!</h1>
        )}
      </div>
    </div>
  );
};

export default Results;
