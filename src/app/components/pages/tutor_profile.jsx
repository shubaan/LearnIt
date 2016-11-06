import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';
import '../../css/tutor_profile.css';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

//http://localhost:3000/tutor_profile?id=1hzTChuk5TXRRelDAgeJCmfu49T2

class TutorProfile extends Component {

  constructor(props) {
    super(props);
    this.props.fetchProfiles();
    this.props.tutor;
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

  renderSubject(tutor) {
    var subjects = [];
    if (tutor.tutorInfo.english) {subjects.push(<li >English</li>);}
    if (tutor.tutorInfo.history) {subjects.push(<li >History</li>);}
    if (tutor.tutorInfo.math) {subjects.push(<li>Math</li>);}
    if (tutor.tutorInfo.science) {subjects.push(<li>Science</li>);}
    if (tutor.tutorInfo.spanish) {subjects.push(<li>Spanish</li>);}
    return subjects;
  }

  render() {
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

    return (
      <div id="tutor_container">
        <Card id="tutor_side">
          <img src={tutor.photoUrl} alt="Profile Image" id="tutor_img"/>
          <h1>{tutor.name}</h1>
          <RaisedButton label="Send A Message" style={button}/>
        </Card>
        <div id="tutor_info">
          <Card id="tutor_bio"> 
            <h3>About me</h3>
            <p>{tutor.bio}</p>
          </Card>
          <Card id="tutor_details"> 
            <h3>Cost</h3>
            <p>${tutor.tutorInfo.payrate} per hour</p>
            <h3>Subjects</h3>
            <ul>
              {this.renderSubject(tutor)}
            </ul>
          </Card>
        </div>
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
      </div>
    );


  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchProfiles}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, profiles: state.profiles};
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorProfile);
