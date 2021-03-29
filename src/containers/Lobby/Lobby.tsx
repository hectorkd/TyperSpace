import React, { ReactNode, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import IPlayer from '../../interfaces/IPlayer';
import PlayersList from '../../components/PlayerList/PlayerList';

import './styles/Lobby.scss';

type LobbyProps = {
  socket: any;
  setSocket: React.Dispatch<React.SetStateAction<undefined>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  children?: ReactNode;
  players: IPlayer[];
  setPlayers: React.Dispatch<React.SetStateAction<IPlayer[]>>;
};

const Lobby: React.FC<LobbyProps> = (props) => {
  const { roomId } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  const [isHost, setIsHost] = useState(false);
  const [rounds, setRounds] = useState<number>(0);
  const [currRound, setCurrRound] = useState<number>(0);

  useEffect(() => {
    //get random paragpraph from server
    //TODO: now use parapgraph from playerinfo!
    props.socket.current.on(
      'getGameState',
      (text: string, rounds: number, currRound: number) => {
        console.log('paragraph from server ', text);
        console.log('number of rounds', rounds);
        console.log('current round', currRound);
        props.setText(text); // don't nee this anymore
        setRounds(rounds);
        setCurrRound(currRound);
      },
    );

    //get players
    props.socket.current.on('playerInfo', (players: IPlayer[]) => {
      console.log(players);
      props.setPlayers(players);
      const player = players.filter(
        (player) => player.userId === props.socket.current.id,
      );
      // console.log('Is host?', player[0].isHost);
      setIsHost(player[0].isHost);
    });
  }, []); //don't add props to array

  useEffect(() => {
    //check if someone applied power ups, apply them to user and update paragraph
  });

  //synchronise timestart for all players
  function handleClickStart(): void {
    props.socket.current.emit('syncStart');
    history.push({
      pathname: `/${roomId}/race`,
    });
  }

  // go to race when host clicked Start Sace
  props.socket.current.on('startRace', () => {
    history.push({
      pathname: `/${roomId}/race`,
    });
  });

  return (
    <div className="lobby-bg-container">
      <div className="lobby-room-display-box"></div>
      <h1>
        Round {currRound} from {rounds}
      </h1>
      <PlayersList players={props.players} />
      <button
        disabled={!isHost}
        onClick={handleClickStart}
        className={isHost ? 'lobby-btn-start' : 'lobby-btn-start-disabled'}
      >
        {' '}
        Start Race{' '}
      </button>
    </div>
  );
};

export default Lobby;
