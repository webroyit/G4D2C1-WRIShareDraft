import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import TextEditor from './TextEditor';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <TextEditor />
        </Route>
        <Route path="/documents/:id">
          <TextEditor />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
