import FireBaseTools from '../../utils/firebase';
import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchMessages, sendMessage}  from '../../actions/firebase_actions';

import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import Chat from './chat';
import WhiteBoard from './whiteboard';

//http://localhost:3000/tutor_profile?id=1hzTChuk5TXRRelDAgeJCmfu49T2

class TutorSession extends Component {

  constructor(props) {
    super(props);

    this.state = { }

    this.fetchSession = this.fetchSession.bind(this);
    this.fetchTheirProfile = this.fetchTheirProfile.bind(this);
  }

  componentDidMount() {
      FireBaseTools.fetchSession(this.getSessionID(), this.fetchSession)
  }

  fetchSession(session) {
    console.log(session)
    var theirId = ""
    switch (this.props.currentUser.uid){
      case session.studentId:
        console.log("I am the student")
        theirId = session.tutorId
        break
      case session.tutorId:
        console.log("I am the tutor")
        theirId = session.studentId
        break
      default:
        console.log("I am not part of this session")
        // leave session now!
    }
    this.setState({
      session: session,
      theirId: theirId
    })
    FireBaseTools.fetchProfile(theirId, this.fetchTheirProfile);
  }

  fetchTheirProfile(profile) {
      this.setState({theirProfile: profile})
  }

  getSessionID() {
    return window.location.search.substring(4)
  }

  render() {
    if (!this.state.theirId) {
      return (<h1>Loading Session...</h1>);
    }

      let containerStyle = {
        width: '100%',
      }

    return (
      <div style={containerStyle}>
        <WhiteBoard sid={this.getSessionID()} />
        <Chat theirId={this.state.theirId} sid={this.getSessionID()} />
      </div>
    );


  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchMessages, sendMessage}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, profiles: state.profiles, messages: state.messages};
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorSession);
