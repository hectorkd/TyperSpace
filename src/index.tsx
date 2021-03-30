import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <div className="moving-bg"> </div>
    <App location={location} />
  </React.StrictMode>,
  document.getElementById('root'),
);
