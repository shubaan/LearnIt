import React, { Component } from 'react';
import Client from './Client';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin() {
    let email = document.getElementById('uid').value;
    let password = document.getElementById('pwd').value;
    if (email === '' || password === "") return;
    //Client.signup(user);
    this.setState({
      user: { email: email , password: password },
    })
  }

  handleLogout() {
    this.setState({
      user: null,
    })
  }

  render() {
    let page;
    if (this.state.user === null) {
      page = <Login handleLogin={this.handleLogin} />;
    } else {
      page = <Main handleLogout={this.handleLogout} email={this.state.user.email}/>;
    }

    return (
      <div className='App'>
        {page}
      </div>
    );
  }
}

class Login extends Component {
  render() {
    return (
        <div className='ui text container'>
          <input type='text' placeholder='email' id='uid'/>
          <input type='password' placeholder='password' id='pwd'/>
          <input type='button' value='submit' onClick={this.props.handleLogin} />
        </div>
    );
  }
}

class Main extends Component {
  render() {
    return (
      <div>
        <h1>Hello {this.props.email}!</h1>
        <input type='button' onClick={this.props.handleLogout} value='logout' />
      </div>
    );
  }
}

export default App;
