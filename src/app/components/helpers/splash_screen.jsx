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


class SplashScreen extends Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        browserHistory.push("/register");
    }

    render() {
        var imageStyle={
          "marginLeft":"69%",
          "width":"30%",
          "position":"absolute"
        }
        var textStyle={
          "marginRight":"30%",
          "marginLeft":"3%"
        }
        var buttonStyle={
          "textAlign":"center"
        }
        return (
            <div>
                <img style={imageStyle} src="http://i.imgur.com/xLGaGy8.png"></img>
                <div style={textStyle}>
                    <h1>
                        Tutors at the click of a button
                    </h1>
                    <p>
                        Welcome to <b>LearnIt</b>, where you can learn any  subject quickly and easily.
                    </p>
                    <p>
                        With our experienced tutors, you can get professional help at your convenience.
                    </p>
                    <h2>
                        Professional-Level Tutors
                    </h2>
                    <p>
                        You choose your own tutor! You can look at reviews other students have given to help make your decision.
                    </p>
                    <p>
                        We encourage students to review their tutors after each session to make sure future students know what they are paying for.
                    </p>
                    <h2>
                        Flexible Scheduling
                    </h2>
                    <p>
                        You make your own schedule! You can browse through a list of tutors to see their availability and schedule a time that works for you.
                        Whether you are a morning person or a night owl, there will a tutor for you waiting for you to schedule a session.
                    </p>
                    <h2>
                        Interested in being a tutor?
                    </h2>
                    <p>
                        You make your own rate and get paid directly from students!
                    </p>
                    
                </div>
                <div style={buttonStyle}>
                    <p>
                        Want to get started? Register today!
                    </p>
                    <RaisedButton label="Register" primary={true} onClick={this.handleClick}/>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
