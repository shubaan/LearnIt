import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../../actions/firebase_actions';
import Header from '../common/header';
import Sidebar from '../common/sidebar';
import Student from './student'
import Tutor from './tutor'

import './home.css';

class Home extends Component {

  constructor(props) {
    super(props);
  }

  tutorButtonClick() {
      console.log("tutor button clicked")
      browserHistory.push("/tutor")
  }

  studentButtonClick() {
      console.log("student button clicked")
      browserHistory.push("/student")
  }

  render() {

    return (
      <div class="homeContainer">
        <Header headerContent={"Fetch Profile and Pass About Me Information Here"}/>
        <Sidebar list={["sidebar 1", "sidebar 2", "sidebar3"]} />
        Home Page
        <div class="buttonContainer">
          <button onClick={this.tutorButtonClick}>Tutor Page</button>
          <button onClick={this.studentButtonClick}>Student Page</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
