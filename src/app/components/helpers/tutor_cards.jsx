import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class TutorCards extends Component {

  constructor(props) {
    super(props);
    if (this.props.profile.name == "" || !this.props.profile.name) {
      this.props.profile.name = "Anonymous";
    }
    this.props.profileIMG;
    this.props.uid;
  }

  goToTutorProfile() {
    console.log(this.props.profile)
    browserHistory.push("/tutor_profile")
  }

  renderSubjects(profile) {
    var subject = [];
    if (profile.math) { subject.push("Math"); }
    if (profile.science) { subject.push("Science"); }
    if (profile.english) { subject.push("English"); }

    var list = [];
    for (var index in subject) {
      var item = (<li>{subject[index]}</li>);
      list.push(item);
    }
    return list;
  }

  renderSubjectsR(profile) {
    var subject = [];
    if (profile.spanish) { subject.push("Spanish"); }
    if (profile.history) { subject.push("History"); }

    var list = [];
    for (var index in subject) {
      var item = (<li>{subject[index]}</li>);
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
      <Card style={cardStyle} onClick={this.goToTutorProfile.bind(this)}>
        <img style={imgStyle} src={this.props.profileIMG} alt="Profile Image"/>
        <h3><b>{this.props.profile.name}</b></h3>
        <h5>Cost: {this.props.profile.payrate} </h5>
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
