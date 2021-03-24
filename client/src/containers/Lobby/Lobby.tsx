import React, { ReactNode, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { IPlayer } from '../../interfaces/Player';
import PlayersList from '../../components/PlayerList/PlayerList';

import './styles/Lobby.scss';

type LobbyProps = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
};

const Lobby: React.FC<LobbyProps> = (props) => {
  const { roomId } = useParams<Record<string, string | undefined>>();
  const history = useHistory();

  const [players, setPlayers] = useState<IPlayer[]>([]);

  useEffect(() => {
    //get random paragpraph from server
    props.socket.current.on('getParagraph', (text: string) => {
      console.log('paragraph from server ', text);
      props.setText('test text');
    });
    //get players
    props.socket.current.on('playerInfo', (players: IPlayer[]) => {
      console.log('received from server for room ', players);
      setPlayers(players);
    });
  }, []); //don't add props to array

  function handleClickStart(): void {
    props.socket.current.emit('syncStart');
    history.push({
      pathname: `/${roomId}/race`,

    });
  }

  return (
    <div className="lobby-bg-container">
      <div className="lobby-room-display-box"></div>
      <PlayersList />
      <button onClick={handleClickStart} className="lobby-btn-start">
        {' '}
        Start Race{' '}
      </button>
    </div>
  );
};

export default Lobby;
