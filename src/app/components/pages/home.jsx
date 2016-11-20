import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import SplashScreen from '../helpers/splash_screen'
import SessionCard from '../helpers/session_cards'
import FireBaseTools from '../../utils/firebase';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = { sessions: [] }
    this.onRecieveSessions = this.onRecieveSessions.bind(this)
  }

  componentDidMount()
  {
    FireBaseTools.fetchMySessions(this.onRecieveSessions)
  }

  onRecieveSessions(sessions) {
    console.log(sessions)
    let s = this.state.sessions
    s.push(sessions)
    this.setState({ sessions: s })
  }

  renderSessions() {
    var result = []
    for (var index in this.state.sessions) {
      let s = this.state.sessions[index]
      result.push(
        <SessionCard
          key={index}
          sid={s.sid}
          tutor={s.tutorId}
          student={s.studentId}
          date={s.startTime}
          time={s.endTime} />
      )
    }
    return <div>{result}</div>
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
      var sessionContainer = {
        justifyContent: 'space-between',
        width: '100%',
        textAlign: 'center',
      }

      var img = "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png"

      return (

        <div style={homeContainer}>
          <h2 style={homeTitle}>Upcoming Sessions:</h2>
          <div style={sessionContainer} >
            {this.renderSessions()}
          </div>
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
