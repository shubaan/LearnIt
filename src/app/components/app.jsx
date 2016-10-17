import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../actions/firebase_actions';

import Header from './common/header';
import Sidebar from './common/sidebar';

class App extends Component {

  constructor(props) {
    super(props);

    this.props.fetchUser();
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    this.props.logoutUser().then(data=> {
      // reload props from reducer
      this.props.fetchUser();
    });
    setState();
  }

  renderUserMenu(currentUser) {
    // if current user exists and user id exists than make user navigation
    if (currentUser && currentUser.uid) {
      return (
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
             aria-haspopup="true" aria-expanded="false">
            {currentUser.email} <span className="caret"></span></a>
          <ul className="dropdown-menu">
            <li><Link to="/account">Edit Profile</Link></li>
            <li role="separator" className="divider"></li>
            <li><Link to="/logout" onClick={this.logOut}>Logout</Link></li>
          </ul>
        </li>
      )
    } else {
      return [
        <li key={1}><Link to="/login">Login</Link></li>,
        <li key={2}><Link to="/register">Register</Link></li>,
        <li key={3}><Link to="/contactus">Contact Us</Link></li>
      ]
    }
  }


  render() {
    let childStyle;
    let loggedInItems;
    if (this.props.currentUser && this.props.currentUser.uid) {
      childStyle = {
        marginLeft: '200px',
        marginTop: '65px',
        padding: '0px 15px 0px 15px',
      }
      loggedInItems = (
        <div>
          <Sidebar
            list={["Home", "Account", "Student", "Tutor"]} 
            link={["/", "/account", "/student", "/tutor"]} />
        </div>
      );
    } else {
      loggedInItems = ""
      childStyle = {
        margin: '0px auto 0px auto'
      }
    }

    var navbar = {
      position: 'fixed',
      widht: '100%',
      top: '0',
      left: '0',
      right: '0',
    }

    return (
      <div>
        <div style={navbar}>
          <header className="navbar navbar-static-top navbar-inverse" id="top" role="banner">
            <div className="container">
              <div className="navbar-header">
                <button className="navbar-toggle collapsed" type="button" data-toggle="collapse"
                data-target=".bs-navbar-collapse"><span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                </button>
                <Link to="/" className="navbar-brand">Learn It</Link>
              </div>
              <nav className="collapse navbar-collapse bs-navbar-collapse" role="navigation">
              <ul className="nav navbar-nav navbar-right">
              {this.renderUserMenu(this.props.currentUser)}
              </ul>
              </nav>
            </div>
          </header>
        </div>
        {loggedInItems}
        <div style={childStyle}>
        {this.props.children}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, logoutUser}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
