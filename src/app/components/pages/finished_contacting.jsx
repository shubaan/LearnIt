import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';

  const divStyle = {
    width: "500px",
    height: "500px",
    overflowY: "auto",
    background: "white",
    margin: "0px auto 0px auto",
  };


class FinishedContacting extends Component {
    constructor(props) {
        super(props);
    }
    returnHome() {
        browserHistory.push("")
    }
    render()
    {
        return (
            <div>
                <p>Your message has been submitted!</p>
                <button onClick={this.returnHome}>Return Home</button>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(FinishedContacting);
