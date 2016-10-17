import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import SplashScreen from './splash_screen'

class Home extends Component {

  constructor(props) {
    super(props);
  }

  renderSessions(tutor,student,date,time,cost) {

    var sessions = {
      border: "1px solid black",
      margin: "15px 20px 15px 20px",
      borderRadius: "10px",
      padding: "10px 0px 10px 0px",
    };
    var sessions_text = {
      display: "inline-block",
      margin: "3px 5px 3px 5px",
    };

    return (
      <div style={sessions}>
        <p style={sessions_text}>Tutor: </p>
        <p style={sessions_text}>{tutor}</p>
        <br />
        <p style={sessions_text}>Student: </p>
        <p style={sessions_text}>{student}</p>
        <br />
        <p style={sessions_text}>Date: </p>
        <p style={sessions_text}>{date}</p>
        <br />
        <p style={sessions_text}>Time: </p>
        <p style={sessions_text}>{time}</p>
        <br />
        <p style={sessions_text}>Cost: </p>
        <p style={sessions_text}>{cost}</p>
        <br />
      </div>
    );
  }

  render() {
    if (this.props.currentUser && this.props.currentUser.uid) {
      var homeContainer = {
        padding: '5px 15px 5px 15px',
      };
      var homeTitle = {
        margin: '0px',
        padding: '0px',
      }

      return (
        <div style={homeContainer}>
          <h2 style={homeTitle}>Upcoming Sessions:</h2>
          {this.renderSessions('Matt', 'Shubaan', 'Monday Oct 17, 2016', '18:00 PST', '$0')}
          {this.renderSessions('Matt', 'Shubaan', 'Monday Oct 17, 2016', '18:00 PST', '$0')}
        </div>
      );
    } else {
      return (
        <div>
          <SplashScreen/>
        </div>
      );
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
