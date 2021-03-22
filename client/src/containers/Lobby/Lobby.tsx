import React, {ReactNode} from 'react';

import './styles/Lobby.scss';

type Props = {
  socket: any, 
  setSocket: any, 
  children?: ReactNode
};

const Lobby: React.FC<Props> = (props) => {
  console.log(props);
  return <div></div>;
};

export default Lobby;
