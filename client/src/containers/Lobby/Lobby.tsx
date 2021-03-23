import React, {ReactNode} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { Player } from '../../interfaces/Player';

import './styles/Lobby.scss';

type Props = {
  socket: any, 
  setSocket: any, 
  text: string,
  setText: any,
  children?: ReactNode
};

const Lobby: React.FC<Props> = (props) => {
  console.log(props);
  const { roomId } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  props.setText('Test paragraph for a race');

  props.socket.current.on('getParagraph', (text: string) => {
    console.log('paragraph from server ', text);
    //TODO: store paragraph
    // props.setText(text);
  });

  props.socket.current.on('players', (roomId: string, players: Player[]) => {
    console.log(players);
    //TODO: show players on a page
  })

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
    <div>
      <button onClick={handleClick}> Start Race </button>
    </div>
  );
};

export default Lobby;
