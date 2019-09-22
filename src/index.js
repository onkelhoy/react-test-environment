import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ChessContext } from './util/context';

import Game from './pages/game';
import Home from './pages/home';
import Login from './pages/login';
import EditableTablePage from './pages/EditableTablePage';
import GuidedTour from './pages/GuidedTour'; 
import Animations from './pages/animations';
import ModdelingPage from './pages/Moddeling';

const App = props => {
  const [turn, setTurn] = useState(true); // this should come from server [whos turn it is]

  return (
    <Router>
      <ChessContext.Provider value={{
        turn, setTurn
      }}>
        <Route path="/" exact component={Home} />
        <Route path="/game/" component={Game} />
        <Route path="/animations/" component={Animations} />
        <Route path="/login/" component={Login} />
        <Route path="/EditableTable/" component={EditableTablePage} />
        <Route path="/guide/" component={GuidedTour} />
        <Route path="/moddeling/" component={ModdelingPage} />
      </ChessContext.Provider>
    </Router>
  )
}

ReactDom.render(<App />, document.getElementById('root'))