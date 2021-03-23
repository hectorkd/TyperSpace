import React, { ReactNode } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { IPlayer } from '../../interfaces/Player';
import PlayersList from '../../components/PlayerList/PlayerList';

import './styles/Lobby.scss';

type Props = {
  socket: any;
  setSocket: any;
  text: string;
  setText: any;
  children?: ReactNode;
};

const Lobby: React.FC<Props> = (props) => {
  //console.log(props);
  const { roomId } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  props.setText('Test text');
  //TODO: put ws events inside useEffect to run it once?
  props.socket.current.on('getParagraph', (text: string) => {
    // console.log('paragraph from server ', text);
    //TODO: store paragraph
    // props.setText(text);
  });

  props.socket.current.on('playerInfo', (players: IPlayer[]) => {
    console.log('received from server for room ', players);
    //TODO: show players on a page, maybe with useEffect?
  });

  function handleClick(): void {
    //TODO: ws emit synchStart
    props.socket.current.emit('syncStart');
    history.push({
      pathname: `/${roomId}/race`,
      // state: {
      //   text: 'Test paragraph for a race'
      // }
    });
  }
  return (
    <div className="lobby-bg-container">
      <div className="lobby-room-display-box"></div>
      <PlayersList />
      <button onClick={handleClick} className="lobby-btn-start">
        {' '}
        Start Race{' '}
      </button>
    </div>
  );
};

export default Lobby;
