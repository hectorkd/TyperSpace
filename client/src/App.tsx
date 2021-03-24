import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Landing from './containers/Landing/Landing';
import Lobby from './containers/Lobby/Lobby';
import Avatar from './containers/Avatar/Avatar';
import Race from './containers/Race/Race';
import Results from './containers/Results/Results';
import IPlayer from './interfaces/IPlayer';

const App: React.FC = () => {
  const [socket, setSocket] = useState();
  const [text, setText] = useState<string>('');
  const [players, setPlayers] = useState<IPlayer[]>([]);

  return (
    <div>
      <Router>
        <Route path="/" exact component={Landing} />
        <Route
          exact
          path="/:roomId/avatar"
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
            />
          )}
        />
      </Router>
    </div>
  );
};

export default App;
