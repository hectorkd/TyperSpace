import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Landing from './containers/Landing/Landing';
import Lobby from './containers/Lobby/Lobby';
import Avatar from './containers/Avatar/Avatar';
import Race from './containers/Race/Race';
import Results from './containers/Results/Results';
import IPlayer from './interfaces/IPlayer';

type AppProps = {
  location: any;
};

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const App: React.FC<AppProps> = ({ location }) => {
  const [socket, setSocket] = useState();
  const [text, setText] = useState<string>('');
  const [players, setPlayers] = useState<IPlayer[]>([]);
  // const location = useLocation();
  console.log('location', location);

  return (
    <div>
      {/* <TransitionGroup in={transitionStyles} timeout={duration}>
        <CSSTransition timeout={1000} classNames="slide" key={location.key}> */}
      <Router>
        {/* <Switch location={location}> */}
        <Route path="/" exact component={Landing} />
        <Route
          exact
          path="/:roomId"
          render={(props) => (
            <Avatar
              {...props}
              socket={socket}
              setSocket={setSocket}
              text={text}
              setText={setText}
              players={players}
              setPlayers={setPlayers}
            />
          )}
        />
        <Route
          exact
          path="/:roomId/lobby"
          render={(props) => (
            <Lobby
              {...props}
              socket={socket}
              setSocket={setSocket}
              text={text}
              setText={setText}
              players={players}
              setPlayers={setPlayers}
            />
          )}
        />
        <Route
          exact
          path="/:roomId/race"
          render={(props) => (
            <Race
              {...props}
              socket={socket}
              setSocket={setSocket}
              text={text}
              setText={setText}
              players={players}
            />
          )}
        />
        <Route
          exact
          path="/:roomId/results"
          render={(props) => (
            <Results
              {...props}
              socket={socket}
              setSocket={setSocket}
              text={text}
              setText={setText}
              players={players}
              setPlayers={setPlayers}
            />
          )}
        />
        {/* </Switch> */}
      </Router>
      {/* </CSSTransition>
      </TransitionGroup> */}
    </div>
  );
};

export default App;
