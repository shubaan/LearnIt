import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';
import RaisedButton from 'material-ui/RaisedButton';

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
        var container = {
            width: '50%',
            margin: '20px auto 0px auto',
        };
        return (
            <div>
                <p>Your message has been submitted!</p>
                <RaisedButton onClick={this.returnHome}>Return Home</RaisedButton>
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
