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

  useEffect(() => {
    //get random paragpraph from server
    props.socket.current.on('getParagraph', (text: string) => {
      console.log('paragraph from server ', text);
      props.setText('test text');
    });
    //get players
    props.socket.current.on('playerInfo', (players: IPlayer[]) => {
      props.setPlayers(players);
      const player = players.filter(
        (player) => player.userId === props.socket.current.id,
      );
      console.log('Is host?', player[0].isHost);
      setIsHost(player[0].isHost);
    });
  }, []); //don't add props to array

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

  //TODO: another style for disabled button?
  return (
    <div className="lobby-bg-container">
      <div className="lobby-room-display-box"></div>
      <PlayersList players={props.players} />
      <button
        disabled={!isHost}
        onClick={handleClickStart}
        className="lobby-btn-start"
      >
        {' '}
        Start Race{' '}
      </button>
    </div>
  );
};

export default Lobby;
