import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';

class Sessions extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.currentUser || !this.props.currentUser.uid) {
      return <div />
    }
    return (
      <div>
        sessions
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

export default connect(mapStateToProps, mapDispatchToProps)(Sessions);