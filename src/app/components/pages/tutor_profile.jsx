import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles, fetchNewNotificationNumber}  from '../../actions/firebase_actions';
import FireBaseTools from '../../utils/firebase';
import '../../css/tutor_profile.css';
import '../../css/react-rater.css'
import Rater from 'react-rater'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';

//http://localhost:3000/tutor_profile?id=1hzTChuk5TXRRelDAgeJCmfu49T2

const subjects = [
  'Math',
  'Science',
  'English',
  'Spanish',
  'History'
];

class TutorProfile extends Component {

  constructor(props) {
    super(props);
    this.props.fetchProfiles();
    this.props.tutor;
    this.state = {
      messageOpen: false,
      message: "",
      requestOpen: false,
      requestDate: null,
      startTime: null,
      endTime: null,
      subject: "",
      description: "",
    }
    this.timer = undefined;
  }

  componentWillUnMount() {
    clearTimeout(this.timer);
  }

  getTutorID () {
    return window.location.search.substring(4)
  }

  getProfile (profiles, id) {
    for (var p in profiles){
      if (p == id)
        return profiles[p];
    }
  }

  handleSendMessageClick() {
      browserHistory.push("/tutor_session?id="+this.getTutorID())
  }

  handleMessageOpen() {
    this.setState({messageOpen: true});
  }

  handleMessageClose() {
    this.setState({messageOpen: false});
  }

  handleSendMessage() {
    FireBaseTools.sendNotification(this.getTutorID(), this.state.message);
    this.setState({messageOpen: false, message: ""});
    this.timer = setTimeout(() => {this.props.fetchNewNotificationNumber();}, 500);
  }

  handleMessageChange(event) {
    this.setState({
      message: event.target.value,
    });
  };

  handleRequestOpen() {
    this.setState({requestOpen: true});
  }

  handleRequestClose() {
    this.setState({requestOpen: false});
  }

  handleSendRequest() {
    if (!this.state.startTime || !this.state.endTime || !this.state.requestDate || this.state.subject=="")
      return;
    var from = new Date(this.state.requestDate.getFullYear(), this.state.requestDate.getMonth(),
      this.state.requestDate.getDate(), this.state.startTime.getHours(), this.state.startTime.getMinutes()).getTime();
    var to = new Date(this.state.requestDate.getFullYear(), this.state.requestDate.getMonth(),
      this.state.requestDate.getDate(), this.state.endTime.getHours(), this.state.endTime.getMinutes()).getTime();
    if (from>to)
      return;
    FireBaseTools.requestSession(this.getTutorID(), this.state.subject, this.state.description, from, to);
    this.setState({requestOpen: false, description: ""});
    this.timer = setTimeout(() => {this.props.fetchNewNotificationNumber();}, 500);
  }

  handleDateChange(event, date) {
    console.log(date);
    this.setState({
      requestDate: date,
    });
  };

  handleStartTimeChange(event, date) {
    console.log(date);
    this.setState({
      startTime: date,
    });
  };

  handleEndTimeChange(event, date) {
    console.log(date);
    this.setState({
      endTime: date,
    });
  };

  handleUpdateInput(value) {
    this.setState({
      subject: value,
    });
  };

  handleDescriptionChange(event) {
    this.setState({
      description: event.target.value,
    });
  };

  renderSubject(tutor) {
    var subjects = [];
    if (tutor.tutorInfo.english) {subjects.push(<li key="1">English</li>);}
    if (tutor.tutorInfo.history) {subjects.push(<li key="2">History</li>);}
    if (tutor.tutorInfo.math) {subjects.push(<li key="3">Math</li>);}
    if (tutor.tutorInfo.science) {subjects.push(<li key="4">Science</li>);}
    if (tutor.tutorInfo.spanish) {subjects.push(<li key="5">Spanish</li>);}
    return subjects;
  }


  render() {
    const messageActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleMessageClose.bind(this)}
      />,
      <FlatButton
        label="Send"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSendMessage.bind(this)}
      />,
    ];

    const requestActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleRequestClose.bind(this)}
      />,
      <FlatButton
        label="Send"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSendRequest.bind(this)}
      />,
    ];

    var id = this.getTutorID()
    var tutor = this.getProfile(this.props.profiles, id);
    if (!tutor) {
      return (<h1>Error, User not Found</h1>);
    }

    var button = {
      marginTop: "13px",
    };
    var inputs = {
      width: "33%",
      minWidth: "200px",
      maxWidth: "300px",
      display: "inline-table",
      marginLeft: "10px",
      marginRight: "10px",
    }

    var session = (
    <Card id="session_card">
      <h3>Request a Session</h3>
      <div id="input_container">
      <div style={inputs}>
      <DatePicker hintText="Select A Date" />
      </div>
      <div style={inputs}>
      <TimePicker hintText="Select A Start Time" />
      </div>
      <div style={inputs}>
      <TimePicker hintText="Select A End Time" />
      </div>
      </div>
      <div id="session_button">
      <RaisedButton label="Request Session"/>
      </div>
    </Card>
    );

    return (
      <div id="tutor_container">
        <Card id="tutor_side">
          <img src={tutor.photoUrl} alt="Profile Image" id="tutor_img"/>
          <h1>{tutor.name}</h1>
          <div><Rater interactive={false} rating={tutor.tutorInfo.rating}/></div>
          <RaisedButton label="Send A Message" style={button} onClick={this.handleMessageOpen.bind(this)}/>
          <RaisedButton label="Request a tutoring session" primary={true} style={button} onClick={this.handleRequestOpen.bind(this)}/>
        </Card>
        <div id="tutor_info">
          <Card id="tutor_bio">
            <h3>About me</h3>
            <p>{tutor.bio}</p>
          </Card>
          <Card id="tutor_details">
            <h3>Cost</h3>
            <p>${tutor.tutorInfo.payrate} per hour</p>
            {/*TODO: change 'value' to the user's paypal button id*/}
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input type="hidden" name="cmd" value="_s-xclick" />
              <input type="hidden" name="hosted_button_id" value="AXFHTR7TGPFQJ" />
              <input type="image" src="https://www.paypal.com/en_US/i/btn/btn_paynow_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Buy Now" />
              <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
            </form>
            <h3>Subjects</h3>
            <ul>
              {this.renderSubject(tutor)}
            </ul>
          </Card>
        </div>

        <Dialog
          title={"Send a message to "+tutor.name}
          actions={messageActions}
          modal={false}
          open={this.state.messageOpen}
          onRequestClose={this.handleMessageClose.bind(this)} >
          <TextField
            value={this.state.message}
            onChange={this.handleMessageChange.bind(this)}
            floatingLabelText="Enter message here"
            multiLine={true}
            rows={3}
            fullWidth={true} />
        </Dialog>
        <Dialog
          title={"Request a tutoring session with "+tutor.name}
          actions={requestActions}
          modal={false}
          open={this.state.requestOpen}
          onRequestClose={this.handleRequestClose.bind(this)}
          autoScrollBodyContent={true} >
          <DatePicker
            hintText="Select A Date"
            value={this.state.requestDate}
            onChange={this.handleDateChange.bind(this)}/>
          <TimePicker
            hintText="Select A Start Time"
            value={this.state.startTime}
            onChange={this.handleStartTimeChange.bind(this)}/>
          <TimePicker
            hintText="Select A End Time"
            value={this.state.endTime}
            onChange={this.handleEndTimeChange.bind(this)}/>
          <AutoComplete
            hintText="Select a subject"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={subjects}
            onNewRequest  ={this.handleUpdateInput.bind(this)}
            onUpdateInput={this.handleUpdateInput.bind(this)}
            openOnFocus={true}/>
          <TextField
            value={this.state.description}
            onChange={this.handleDescriptionChange.bind(this)}
            floatingLabelText="Enter any comments here"
            multiLine={true}
            rows={3}
            fullWidth={true} />
        </Dialog>
      </div>
    );


  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchProfiles, fetchNewNotificationNumber}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, profiles: state.profiles};
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorProfile);
