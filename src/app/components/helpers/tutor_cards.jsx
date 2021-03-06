import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../../css/react-rater.css'
import Rater from 'react-rater'
import {fetchUser}  from '../../actions/firebase_actions';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class TutorCards extends Component {

  constructor(props) {
    super(props);
    if (this.props.profile.name == "" || !this.props.profile.name) {
      this.props.profile.name = "Anonymous";
    }
    this.props.profileIMG;
    this.props.uid;
    this.state = {shadow: 1};
  }

  onMouseOver() {
    //console.log(this.state.shadow);
    this.setState({shadow: 3});
  }
  onMouseOut() {
    //console.log(this.state.shadow);
    this.setState({shadow: 1});
  }

  goToTutorProfile() {
    console.log(this.props.profile)
    let profileId = this.props.profile.key;
    browserHistory.push("/tutor_profile?id="+profileId)
  }

  renderSubjects(profile) {
    var subject = [];
    if (profile.tutorInfo.math) { subject.push("Math"); }
    if (profile.tutorInfo.science) { subject.push("Science"); }
    if (profile.tutorInfo.english) { subject.push("English"); }

    var list = [];
    for (var index in subject) {
      var item = (<li key={index} >{subject[index]}</li>);
      list.push(item);
    }
    return list;
  }

  renderSubjectsR(profile) {
    var subject = [];
    if (profile.tutorInfo.spanish) { subject.push("Spanish"); }
    if (profile.tutorInfo.history) { subject.push("History"); }

    var list = [];
    for (var index in subject) {
      var item = (<li key={index} >{subject[index]}</li>);
      list.push(item);
    }
    return list;
  }

  render() {

    var cardStyle = {
      display: 'inline-table',
      width: '250px',
      height: '275px',
      textAlign: 'center',
      margin: '15px',
    }

    var imgStyle = {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      marginTop: '20px',
    }

    var cardText = {
      textAlign: 'left',
      marginLeft: '20px',
      padding: '0px',
    }

    var list = {
      float: 'left',
    }

    return (
      <Card style={cardStyle}
            onClick={this.goToTutorProfile.bind(this)}
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            zDepth={this.state.shadow}>
        <img style={imgStyle} src={this.props.profileIMG} alt="Profile Image"/>
        <h3><b>{this.props.profile.name}</b></h3>
        <Rater interactive={false} rating={this.props.profile.tutorInfo.rating}/>
        <h5>${this.props.profile.tutorInfo.payrate} Hourly</h5>
        <CardText style={cardText}>
          <ul style={list}>
            {this.renderSubjects(this.props.profile)}
          </ul>
          <ul style={list}>
            {this.renderSubjectsR(this.props.profile)}
          </ul>
        </CardText>
      </Card>
    );
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorCards);
