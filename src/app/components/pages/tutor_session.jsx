import FireBaseTools from '../../utils/firebase';
import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchMessages, sendMessage}  from '../../actions/firebase_actions';

import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import Chat from './chat';
import WhiteBoard from './whiteboard';

import '../../css/react-rater.css'
import Rater from 'react-rater'

//http://localhost:3000/tutor_profile?id=1hzTChuk5TXRRelDAgeJCmfu49T2

class TutorSession extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openExit: false,
      openRate: false,
      openAlert: false,
      comment: "",
      rating: 3,
      hoverRating: 3,
      ended: false,
      session: null,
      theirId: null,
      theirProfile: null
    };

    this.fetchSession = this.fetchSession.bind(this);
    this.fetchTheirProfile = this.fetchTheirProfile.bind(this);

    this.timer = undefined;
  }

  componentWillUnMount() {
    clearTimeout(this.timer);
  }

  componentDidMount() {
      FireBaseTools.fetchSession(this.getSessionID(), this.fetchSession)
  }

  fetchSession(session) {
    //console.log(session);
    var theirId = "";
    switch (this.props.currentUser.uid){
      case session.studentId:
        //console.log("I am the student");
        theirId = session.tutorId;
        break;
      case session.tutorId:
        //console.log("I am the tutor");
        theirId = session.studentId;
        break;
      default:
        //console.log("I am not part of this session");
        browserHistory.push("/"); // leave session now!
    }
    if (!this.state.ended && session.status && this.state.session) {
      if (session.status == "completed" && this.state.session.status != "completed")
        this.timer = setTimeout(() => {this.setState({openAlert: true});}, 500);
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

  handleComplete() {
    this.setState({openExit: false, ended: true});
    FireBaseTools.completeSession(this.getSessionID(), this.endSession.bind(this));
  }

  endSession(result) {
    if (result.success) {
      this.setState({ended: true});
      if (this.state.session.studentId == this.props.currentUser.uid) {
        this.setState({openRate: true});
      } else {
        browserHistory.push("/");
      }
    }
    else {
      this.setState({ended: false});
    }
  }

  handleOpenExit() {
    this.setState({openExit: true});
  };

  handleCloseExit() {
    this.setState({openExit: false});
  };

  handleCloseRate() {
    this.setState({openRate: false});
    browserHistory.push("/");
  };

  handleCloseAlert() {
    this.setState({openAlert: false});
    var result = {
      success: true,
      message: this.state.theirProfile.name+" ended the session"
    };
    this.endSession(result);
  };

  handleRate({ rating, lastRating, originalEvent }) {
    if (originalEvent.type === 'click') {
      //console.log("clicked: rating="+rating);
      this.setState({
        rating: rating,
      });
    }
    else if (originalEvent.type === 'mousemove') {
      this.setState({
        hoverRating: rating,
      });
    }
    else if (originalEvent.type === 'mouseleave') {
      this.setState({
        hoverRating: this.state.rating,
      });
    }
  }

  handleReviewChange(event) {
    this.setState({
      comment: event.target.value,
    });
  };

  handleSubmitReview() {
    this.setState({openRate: false});
    FireBaseTools.rateSession(this.getSessionID(), this.state.theirId, this.state.rating, this.state.comment, this.endReview.bind(this));
  };

  endReview(result) {
    //console.log("in end review");
    if (result.success) {
      //console.log("reviewed");
    }
    browserHistory.push("/");
  }

  render() {
    if (!this.state.theirId) {
      return (<h1>Loading Session...</h1>);
    }

    const exitActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleCloseExit.bind(this)}
      />,
      <FlatButton
        label="End Session"
        primary={true}
        onTouchTap={this.handleComplete.bind(this)}
      />,
    ];

    const rateActions = [
      <FlatButton
        label="Skip"
        primary={true}
        onTouchTap={this.handleCloseRate.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmitReview.bind(this)}
      />,
    ];

    const alertActions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleCloseAlert.bind(this)}
      />,
    ];

    let whiteBoardCardStyle = {
        width: "700px",
        height: "500px",
        float: "left",
        margin: "50px"
    };

    let canvasStyle = {
      width: "700px",
      height: "500px",
    };

    let buttonStyle = {
      marginRight: "10px",
      float: "right",
    };

    return (
      <div>
        <RaisedButton
          label="End Session"
          primary={true}
          disabled={this.state.session.status == "completed"}
          style={buttonStyle}
          onClick={this.handleOpenExit.bind(this)}/>
        <Chat theirId={this.state.theirId} sid={this.getSessionID()} />
        <Card style={whiteBoardCardStyle}>
          <WhiteBoard canvasStyle={canvasStyle} sid={this.getSessionID()} />
        </Card>
        <Dialog
          title="End Session"
          actions={exitActions}
          modal={false}
          open={this.state.openExit}
          onRequestClose={this.handleCloseExit.bind(this)}
        >
          Are you ready to end this tutoring session?
        </Dialog>
        <Dialog
          actions={alertActions}
          modal={true}
          open={this.state.openAlert && !this.state.openRate}
          onRequestClose={this.handleCloseAlert.bind(this)}
        >
          The session has been ended.
        </Dialog>
        <Dialog
          title={"Rate The Tutor"}
          actions={rateActions}
          modal={true}
          open={this.state.openRate}
          onRequestClose={this.handleCloseRate.bind(this)}
        >
          {"How do you rate "+this.state.theirProfile.name+" as a tutor?"}
          <p/>
          <Rater rating={this.state.rating} onRate={this.handleRate.bind(this)} />
          <span>{"  "+this.state.hoverRating+"/5"}</span>
          <p/>
          <TextField
            floatingLabelText="Enter Review Here"
            multiLine={true}
            rows={2}
            value={this.state.comment}
            onChange={this.handleReviewChange.bind(this)}
          />
        </Dialog>
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
