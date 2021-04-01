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

const App: React.FC<AppProps> = ({ location }) => {
  const [socket, setSocket] = useState();
  const [text, setText] = useState<string>('');
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [final, setFinal] = useState(false);
  const [rounds, setRounds] = useState(1);
  const [currRound, setCurrRound] = useState(0);
  // const location = useLocation();
  console.log('location', location);

  return (
    <Router>
      <div>
        <TransitionGroup>
          <Switch location={location}>
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
                  rounds={rounds}
                  setRounds={setRounds}
                  setCurrRound={setCurrRound}
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
                  rounds={rounds}
                  currRound={currRound}
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
                  final={final}
                  setFinal={setFinal}
                  rounds={rounds}
                  setRounds={setRounds}
                  currRound={currRound}
                  setCurrRound={setCurrRound}
                />
              )}
            />
            <Route
              exact
              path="/:roomId/final"
              render={(props) => (
                <Results
                  {...props}
                  socket={socket}
                  setSocket={setSocket}
                  text={text}
                  setText={setText}
                  players={players}
                  setPlayers={setPlayers}
                  final={final}
                  setFinal={setFinal}
                  rounds={rounds}
                  setRounds={setRounds}
                  currRound={currRound}
                  setCurrRound={setCurrRound}
                />
              )}
            />
          </Switch>
          {/* </CSSTransition> */}
        </TransitionGroup>
      </div>
    </Router>
  );
};

export default App;
