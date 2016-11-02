import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

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

  renderSubject(tutor, style) {
    var subjects = [];
    if (tutor.tutorInfo.english) {subjects.push(<li style={style}>English</li>);}
    if (tutor.tutorInfo.history) {subjects.push(<li style={style}>History</li>);}
    if (tutor.tutorInfo.math) {subjects.push(<li style={style}>Math</li>);}
    if (tutor.tutorInfo.science) {subjects.push(<li style={style}>Science</li>);}
    if (tutor.tutorInfo.spanish) {subjects.push(<li style={style}>Spanish</li>);}
    return subjects;
  }

  render() {
    var id = this.getTutorID()
    var tutor = this.getProfile(this.props.profiles, id);
    if (!tutor) {
      return (<h1>Error, User not Found</h1>);
    }


    var firstCard = {
      textAlign: "center",
      minWidth: "500px",
      width: "80%",
      marginTop: "100px",
      marginBottom: "20px",
      marginLeft: "auto",
      marginRight: "auto",
      padding: "20px",
    };
    var cardStyle = {
      textAlign: "center",
      minWidth: "500px",
      width: "80%",
      marginTop: "20px",
      marginBottom: "20px",
      marginLeft: "auto",
      marginRight: "auto",
      padding: "20px",
    }
    var tutorImg = {
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      marginTop: "20px",
    };
    var tutorBio = {
      marginLeft: "5%",
      width: "80%",
      minWidth: "450px",
      margin: "auto",
      textAlign: "left",
    };
    var list = {
      padding: "0px"
    }
    var subjectHeading = {
      marginTop: "30px",
    };
    var subjectStyle = {
      textDecoration: "none",
      display: "inline-block",
      minWidth: "100px",
      width: "20%",
    }
    var container = {
      textAlign:"center",
    };
    var button = {
      margin: "5px 10px 20px 10px"
    };


    return (
      <div>
        <Card style={cardStyle}>
          <img src={tutor.photoUrl} alt="Profile Image" style={tutorImg}/>
          <h1>{tutor.name}</h1>
        </Card>
        <Card style={cardStyle}> 
          <h3>About me</h3>
          <h4 style={tutorBio}>{tutor.bio}</h4>
        </Card>
        <Card style={cardStyle}>
          <h2>Cost</h2>
          <h4>${tutor.tutorInfo.payrate} per hour</h4>
          <h2 style={subjectHeading}>Subject</h2>
          <ul style={list}>
            {this.renderSubject(tutor, subjectStyle)}
          </ul>
        </Card>
        <div style={container}>
          <RaisedButton label="Send Message" primary={true} style={button}/>
          <RaisedButton label="Request Session" primary={true} style={button}/>
        </div>
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
