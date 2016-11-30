import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Rater from 'react-rater'
import '../../css/react-rater.css'
import {fetchUser}  from '../../actions/firebase_actions';
import FireBaseTools from '../../utils/firebase';
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {grey400} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

class SessionCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shadow: 1,
      openCancel: false
    };

    this.props.fetchUser();
    this.goToSession = this.goToSession.bind(this)
    this.fetchTutorProfile = this.fetchTutorProfile.bind(this)
    this.fetchStudentProfile = this.fetchStudentProfile.bind(this)
  }

  componentDidMount() {
    FireBaseTools.fetchProfile(this.props.session.tutorId, this.fetchTutorProfile);
    FireBaseTools.fetchProfile(this.props.session.studentId, this.fetchStudentProfile);
  }

  fetchTutorProfile(profile) {
      this.setState({tutorProfile: profile})
  }
  fetchStudentProfile(profile) {
      this.setState({studentProfile: profile})
  }

  onMouseOver() {
    this.setState({shadow: 3});
  }
  onMouseOut() {
    this.setState({shadow: 1});
  }
  //
  // goToLive () {
  //   browserHistory.push("/live");
  // }

  goToSession () {
    browserHistory.push("/tutor_session?id="+this.props.session.sid);
  }

  handlePay() {
    //console.log('paypal btn clicked');
    FireBaseTools.payForSession(this.props.session.sid, this.props.session, this.showMessage.bind(this));
  }

  handleOpenCancel() {
    //console.log(this.props.session.sid);
    this.setState({openCancel: true});
  }

  handleCloseCancel() {
    this.setState({openCancel: false});
  }

  handleCancel() {
    this.setState({openCancel: false});
    FireBaseTools.cancelSession(this.props.session.sid, this.props.session, this.showMessage.bind(this))
  }

  showMessage(result) {
    console.log(result.message);
  }

  handleAcceptPayment() {
    FireBaseTools.acceptPayForSession(this.props.session.sid, this.props.session, this.showMessage.bind(this))
  }

  render() {
    const cancelActions = [
      <FlatButton
        label="No"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleCloseCancel.bind(this)}
      />,
      <FlatButton
        label="Yes"
        primary={true}
        onTouchTap={this.handleCancel.bind(this)}
      />,
    ];

    if (!this.state.tutorProfile || !this.state.studentProfile || !this.props.currentUser) {
      return <CircularProgress size={80} thickness={5} />;
    }

    var cardStyle = {
      display: 'inline-block',
      width: '375px',
      margin: '15px',
    }

    var isTutor = (this.props.currentUser.uid == this.props.session.tutorId);
    var other = isTutor ? this.state.studentProfile : this.state.tutorProfile;
    var startTime = new Date(this.props.session.startTime);
    var endTime = new Date(this.props.session.endTime);
    var price = "$"+Math.round(this.state.tutorProfile.tutorInfo.payrate*(this.props.session.endTime-this.props.session.startTime)/(36000))/100.0;
    var statusRender, paymentRender, ratingRender;

    if (this.props.live) {
      statusRender = <span style={{color: 'Lime', fontSize: '18pt'}}>LIVE</span>;
    } else {
      statusRender = this.props.session.status;
    }

    if (isTutor) {
      if (this.props.session.paymentStatus == "unpaid") {
        paymentRender = <div>
            You are owed {price} from the student.<br/>
            Have you been paid?<br/>
            <RaisedButton
              label="Yes"
              onTouchTap={this.handleAcceptPayment.bind(this)}
            />
        </div>;
      } else {
        paymentRender = <div></div>;
      }
    } else {
      if (this.props.session.paymentStatus != "paid") {
        paymentRender = <div>
          <p>You owe {price} to the tutor</p>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" onTouchTap={this.handlePay.bind(this)}>
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="VGC8NHTNFS4SG" />
            <input type="image" src="https://www.paypal.com/en_US/i/btn/btn_paynow_LG.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Buy Now" />
            <img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </div>;
      } else {
        paymentRender = <div></div>;
      }
    }

    if (this.props.session.status == "completed") {
      var who = isTutor ? "the student" : "you";
      var comment = this.props.session.rating > 0 ? this.props.session.comment : "No rating given";
      ratingRender = <div>
        <br/><b>How {who} rated the session: </b><br/>
        <Rater interactive={false} rating={this.props.session.rating}/><br/>
        <span style={{color: grey400}}>{comment}</span>
      </div>;
    } else {
      ratingRender = <div></div>;
    }

    return (
      <div style={cardStyle}>
        <Card
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            zDepth={this.state.shadow}>
          <CardHeader
            title={other.name}
            subtitle={isTutor ? "Your student" : "Your tutor"}
            avatar={other.photoUrl}
          />
          <CardText>
            <p><b>Current Status: </b>{statusRender}</p>
            <p><b>Time: </b>On {days[startTime.getDay()]}, {startTime.toLocaleDateString()}
            <br/>From {startTime.toLocaleTimeString()} to {endTime.toLocaleTimeString()}</p>
            <p><b>Subject: </b>{this.props.session.subject}</p>
            <p><b>Description: </b>{this.props.session.description}</p>
            <p><b>Payment Status: </b>{this.props.session.paymentStatus}<br/></p>
            {paymentRender}
            {ratingRender}
          </CardText>
          <CardActions>
            <FlatButton
              label="Start Session"
              primary={true}
              onTouchTap={this.goToSession.bind(this)}
              disabled={this.props.session.status != "scheduled"}
            />
            <FlatButton
              label="Cancel"
              secondary={true}
              onTouchTap={this.handleOpenCancel.bind(this)}
              disabled={this.props.session.status != "scheduled"}
            />
          </CardActions>
        </Card>
        <Dialog
          title="Cancel Session"
          actions={cancelActions}
          modal={false}
          open={this.state.openCancel}
          onRequestClose={this.handleCloseCancel.bind(this)}
        >
          Are you sure you want to cancel this tutoring session?
        </Dialog>
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

export default connect(mapStateToProps, mapDispatchToProps)(SessionCard);
