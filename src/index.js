import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Game from './pages/game';
import Home from './pages/home';
import Login from './pages/login';
import EditableTablePage from './pages/EditableTablePage';
import GuidedTour from './pages/GuidedTour'; 
import Animations from './pages/animations';
import ModdelingPage from './pages/Moddeling';

import en_translations from './translations/en.json';
import { withLocalize } from 'react-localize-redux';

const App = withLocalize((props) => {
  props.addTranslation(en_translations);

  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/game/" component={Game} />
      <Route path="/animations/" component={Animations} />
      <Route path="/login/" component={Login} />
      <Route path="/EditableTable/" component={EditableTablePage} />
      <Route path="/guide/" component={GuidedTour} />
      <Route path="/moddeling/" component={ModdelingPage} />
    </Router>
  )
});

ReactDom.render(<App />, document.getElementById('root'));