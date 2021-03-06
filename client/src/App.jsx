import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import SignIn from './Pages/login.jsx';
import SignUp from './Pages/signup.jsx';
import Register from './Pages/register.jsx';
import Admin from './Dashboard/layouts/Admin';
import ForgotPassword from './Pages/forgotPassword';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' component={SignIn} />
            <Route path='/user/signup' component={SignUp} />
            <Route path='/user/forgotPassword' component={ForgotPassword} />
            <Route path='/user/register' component={Register} />
            <Route path='/admin' component={Admin} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
