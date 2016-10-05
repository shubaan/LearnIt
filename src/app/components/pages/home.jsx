import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../../actions/firebase_actions';
import Header from '../common/header';
import Sidebar from '../common/sidebar';
import Student from './student'
import Tutor from './tutor'
import ButtonContainer from './button_container'

class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <Header />
        <Sidebar list={["sidebar 1", "sidebar 2", "sidebar3"]} />
        Home Page
        <ButtonContainer/>
        <Student />
        <Tutor />
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
