import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import SessionCard from '../helpers/session_cards'
import FireBaseTools from '../../utils/firebase';

class Sessions extends Component {

  constructor(props) {
    super(props);
    this.state = { sessions: [] };
    this.onRecieveSessions = this.onRecieveSessions.bind(this);
  }

  componentDidMount() {
    FireBaseTools.fetchMySessions(this.onRecieveSessions);
  }

  onRecieveSessions(sessions) {
    let s = this.state.sessions;
    s.push(sessions);
    this.setState({ sessions: s });
  }

  renderSessions() {
    //for browser compatibility
    if (!Date.now) {
      Date.now = function() { return new Date().getTime(); }
    }

    var result = [];
    var now = Date.now();
    for (var index in this.state.sessions) {
      let s = this.state.sessions[index];
      if (s.status == "completed" || s.status == "rejected" || s.endTime < now)
        result.push(
          <SessionCard
            key={index}
            sid={s.sid}
            tutorId={s.tutorId}
            studentId={s.studentId}
            date={s.startTime}
            endTime={s.endTime}
            subject={s.subject}
            description={s.description}
            paymentStatus={s.paymentStatus}
            status={s.status}
          />
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
      return (

        <div style={homeContainer}>
          <h2 style={homeTitle}>Past Sessions:</h2>
          <div style={sessionContainer} >
            {this.renderSessions()}
          </div>
        </div>
      );
    } else {
      return (
        <div style={homeContainer}>
          <h2>You have no past sessions</h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(Sessions);
