import React, { ReactNode } from 'react';
import './styles/Results.scss';

type Props = {
  socket: any, 
  setSocket: any, 
  children?: ReactNode
};

const Results: React.FC<Props> = (props) => {
  return <div>Hello Results</div>;
};

export default Results;