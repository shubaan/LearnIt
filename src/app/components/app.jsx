import React, {Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../actions/firebase_actions';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';

import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class Login extends Component {
  static muiName = 'FlatButton';
  constructor(props) {
    super(props);
  }
  goToLogin() {
    browserHistory.push("/login");
  }
  goToRegister() {
    browserHistory.push("/register");
  }
  render() {
    return (
      <ul>
      <FlatButton {...this.props} label="Login" onClick={this.goToLogin.bind(this)}/>
      <FlatButton {...this.props} label="Register" onClick={this.goToRegister.bind(this)}/>
      </ul>
    );
  }
}


class Logged extends Component {
  static muiName = 'IconMenu';
  constructor(props) {
    super(props);
  }
  goToAccount() {
    browserHistory.push("/account");
  }
  goToHelp() {
    browserHistory.push("/help");
  }
  goToLogin() {
    this.props.goToLogin();
  }
  render() {
    let style = {
      color: 'white',
      position: 'absolute',
      top:0,
      right:0,
      marginTop: '15px',
      marginRight: '45px'
    }

    let name;
    if (this.props.person == "" || !this.props.person) {
      name = "Anonymous";
    } else {
      name = this.props.person
    }
    return (
      <div>
      <FlatButton style={style} label={name} onClick={this.goToAccount.bind(this)}/>
      <IconMenu
        {...this.props}
        iconButtonElement={ <IconButton><MoreVertIcon /></IconButton> }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
            <MenuItem primaryText="My Account" onClick={this.goToAccount.bind(this)} />
            <MenuItem primaryText="Help" onClick={this.goToHelp.bind(this)} />
            <MenuItem primaryText="Logout" onClick={this.goToLogin.bind(this)} />
      </IconMenu>
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {open: false};
    this.props.fetchUser();
  }

  goToLogin() {
    //console.log("attempting logout");
    this.props.logoutUser().then(data=> {
      //console.log("logged out");
      browserHistory.push("/login");
    });
  }

  getChildContext() {
      return { muiTheme: getMuiTheme(baseTheme) };
  }

  toggleDrawer() {
    this.setState({open: !this.state.open});
  }


  handleClose = () => this.setState({open: false});

  goToHome() {
    browserHistory.push("/")
    this.setState({open: false});
  }

  goToAccount() {
    browserHistory.push("/account");
    this.setState({open: false});
  }

  goToTutors() {
    browserHistory.push("/tutors")
    this.setState({open: false});
  }

  goToSessions() {
    browserHistory.push("/sessions")
    this.setState({open: false});
  }

  goToScheduling() {
    browserHistory.push("/tutor")
    this.setState({open: false});
  }

  handleTitleClick() {
    browserHistory.push("/");
  }

  renderUserMenu(currentUser) {
    // if current user exists and user id exists they are logged in
    //console.log("current user: "+currentUser);
    if (currentUser)
      //console.log("current user id: "+currentUser.uid);
    if (currentUser && currentUser.uid) {
      //console.log("name: "+currentUser.displayName);
      return <Logged person={currentUser.displayName} goToLogin={this.goToLogin.bind(this)}/>;
    }
    else {
      return (
        <Login />
      )
    }
  }

  render() {
    let appbarstyle = {
      cursor: 'pointer',
      backgroundColor: 'orange',
      position: 'fixed',
      top:0,
      left:0
    };
    let childrenstyle = {
      marginTop: '80px'
    }

    let drawer;
    if (this.props.currentUser && this.props.currentUser.uid) {
      drawer = (
      <Drawer
        docked={false}
        width={200}
        open={this.state.open}
        onRequestChange={(open) => this.setState({open})} >
          <MenuItem onTouchTap={this.goToTutors.bind(this)}>Find a Tutor</MenuItem>
          <MenuItem onTouchTap={this.goToHome.bind(this)}>Notifications</MenuItem>
          <MenuItem onTouchTap={this.goToSessions.bind(this)}>Past Sessions</MenuItem>
          <MenuItem onTouchTap={this.goToAccount.bind(this)}>My Account</MenuItem>
          <MenuItem onTouchTap={this.goToScheduling.bind(this)}>Schedule a Sessions</MenuItem>
      </Drawer>
      );
    } else {
      drawer = "";
    }
    return (
      <div>
        <AppBar
          style={appbarstyle}
          title="Learn It"
          onTitleTouchTap={this.handleTitleClick.bind(this)}
          onLeftIconButtonTouchTap={this.toggleDrawer.bind(this)}
          iconElementRight={this.renderUserMenu(this.props.currentUser)}
        />
        {drawer}
        <div className="childrenContainer" style={childrenstyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, logoutUser}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
