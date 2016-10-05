import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../../actions/firebase_actions';

class ButtonContainer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TutorButton/>
        <StudentButton/>
      </div>
    );
  }
}

class TutorButton extends Component {
    tutorButtonClick() {
        console.log("tutor button clicked")
        browserHistory.push("/tutor")
    }
    render() {
        return (
            <button onClick={this.tutorButtonClick}>Tutor Page</button>
        )
    }
}

class StudentButton extends Component {
    studentButtonClick() {
        console.log("student button clicked")
        browserHistory.push("/student")
    }
    render() {
        return (
            <button onClick={this.studentButtonClick}>Student Page</button>
        )
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, logoutUser}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonContainer);
