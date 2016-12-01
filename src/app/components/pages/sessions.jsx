import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import SessionCard from '../helpers/session_cards'
import FireBaseTools from '../../utils/firebase';
import LinearProgress from 'material-ui/LinearProgress';
import {Card} from 'material-ui/Card';

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
    var i = 0;
    while (i < s.length) {
      if (s[i].sid == sessions.sid)
        break;
      i++;
    }
    s[i] = sessions;
    this.setState({ sessions: s });
  }

  renderSessions() {
    //for browser compatibility
    if (!Date.now) {
      Date.now = function() { return new Date().getTime(); }
    }

    var noStyle = {
      textAlign: 'center',
      width: '500',
      marginTop: '5',
      padding: '5',
      marginLeft: 'calc(50% - 250px)'
    }

    var result = [];
    var now = Date.now();
    var sessions = this.state.sessions.slice().sort(function(a, b) {
      return b.startTime-a.startTime;
    });
    sessions.forEach(function(s) {
      if (s.status == "completed" || (s.status == "scheduled" && s.endTime < now)) {
        result.push(
          <SessionCard
            key={s.sid}
            session={s}
            live={false}
            past={true}
          />
        )
      }
    });
    if (result.length > 0)
      return <div>{result}</div>
    else
      return <Card style={noStyle}><h3>You have no past sessions</h3></Card>
  }

  render() {
    if (this.props.currentUser && this.props.currentUser.uid) {
      var homeContainer = {
        padding: '5px 15px 5px 15px',
      };
      var homeTitle = {
        margin: '0px',
        padding: '0px',
        textAlign: 'center'
      }
      var sessionContainer = {
        justifyContent: 'space-between',
        width: '100%',
        //textAlign: 'center',
      }
      return (

        <div style={homeContainer}>
          <h2 style={homeTitle}>Past Sessions</h2>
          <div style={sessionContainer} >
            {this.renderSessions()}
          </div>
        </div>
      );
    } else {
      return (
        <LinearProgress mode="indeterminate" />
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
