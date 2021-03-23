import React, { ReactNode } from 'react';
import './styles/Results.scss';

type Props = {
  socket: any, 
  setSocket: any,
  text: string,
  setText: any, 
  children?: ReactNode
};

const Results: React.FC<Props> = (props) => {
  return <div>Hello Results</div>;
};

export default Results;