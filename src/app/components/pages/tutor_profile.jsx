import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import {fetchProfiles}  from '../../actions/firebase_actions';

class TutorProfile extends Component {

  constructor(props) {
    super(props);
    //this.props.fetchProfiles();
  }

  getTutorID () {
    return window.location.search.substring(4)
  }

  render() {
    var id = this.getTutorID()

    return (
      <div>
        Tutor Profile {id}
      </div>
    );
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorProfile);