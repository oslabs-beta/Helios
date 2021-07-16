import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import SignIn from './Pages/login.jsx';
import SignUp from './Pages/signup.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const testClick = () => {
      fetch('/test')
        .then((res) => res.json())
        .then((data) => console.log('success'))
        .catch((err) => console.log(err));
    };
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' component={SignIn} />
            <Route path='/signup' component={SignUp} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
