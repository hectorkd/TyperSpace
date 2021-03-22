import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Landing from './containers/Landing/Landing';
import Lobby from './containers/Lobby/Lobby';
import Avatar from './containers/Avatar/Avatar';
import Race from './containers/Race/Race';
import Results from './containers/Results/Results';

import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Route path="/" exact component={Landing} />
        <Route exact path='/:roomId' component={Avatar} />
        <Route exact path='/:roomId/lobby' component={Lobby}/>
        <Route exact path='/:roomId/race' component={Race}/>
        <Route exact path='/:roomId/results' component={Results} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
