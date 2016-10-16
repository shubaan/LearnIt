import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../../actions/firebase_actions';
import Header from '../common/header';
import Sidebar from '../common/sidebar';
import SplashScreen from './splash_screen'

class Home extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    return (
      <div>
            <SplashScreen/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
