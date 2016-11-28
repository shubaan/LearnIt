import React, {Component} from 'react';
import firebase from '../../utils/firebase';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, updateUser, fetchBio, saveBio, fetchTutorInfo, saveTutorInfo, fetchIsTutor, saveIsTutor}  from '../../actions/firebase_actions';
import ChangePassword from './change_password';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import TutorForm from './tutor_form';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

class UserAccount extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.props.fetchBio();
    this.props.fetchTutorInfo();
    this.props.fetchIsTutor();
    this.state = {
      message: '',
      //profile: {}
      isTutor: false,
      tutorInfo: {},
      bio: '',
      name: '',
      open: false,
    }
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.isTutor == true || nextProps.isTutor === false) {
        this.setState({isTutor: nextProps.isTutor});
      }
      if (nextProps.currentUser) {
        this.setState({name: nextProps.currentUser.displayName});
      }
      if (nextProps.tutorInfo) {
        this.setState({tutorInfo: nextProps.tutorInfo});
      }
      if ("bio: "+nextProps.bio) {
        this.setState({bio: nextProps.bio});
      }
  }

  componentDidUpdate() {
    /*if (this.props.tutorInfo && this.state.tutorInfo == {}) {
      console.log("update state again to match props")
      this.setState({tutorInfo: this.props.tutorInfo});
    }*/
  }

  onFormSubmit = (event) => {
    if (this.state.tutorInfo != {}) {
      this.props.saveIsTutor(this.state.isTutor)
      this.props.saveTutorInfo(this.state.tutorInfo);
      this.props.updateUser({displayName: this.state.name});
      this.props.saveBio(this.state.bio);
      this.setState({
        open: true,
      });
    }
  };

  isTutorChecked = () => {
    this.setState({isTutor: !this.state.isTutor});
  };

  isMathChecked = () => {
    var tutorInfo = this.state.tutorInfo;
    tutorInfo.math = !this.state.tutorInfo.math;
    this.setState({tutorInfo: tutorInfo});
  };

  isScienceChecked = () => {
    var tutorInfo = this.state.tutorInfo;
    tutorInfo.science = !this.state.tutorInfo.science;
    this.setState({tutorInfo: tutorInfo});
  };

  isEnglishChecked = () => {
    var tutorInfo = this.state.tutorInfo;
    tutorInfo.english = !this.state.tutorInfo.english;
    this.setState({tutorInfo: tutorInfo});
  };

  isSpanishChecked = () => {
    var tutorInfo = this.state.tutorInfo;
    tutorInfo.spanish = !this.state.tutorInfo.spanish;
    this.setState({tutorInfo: tutorInfo});
  };

  isHistoryChecked = () => {
    var tutorInfo = this.state.tutorInfo;
    tutorInfo.history = !this.state.tutorInfo.history;
    this.setState({tutorInfo: tutorInfo});
  };

  handlePaySlider = (event, value) => {
    var tutorInfo = this.state.tutorInfo;
    tutorInfo.payrate = value;
    this.setState({tutorInfo: tutorInfo});
  };

  handleBioEdited = (event, value) => {
    this.setState({bio: value});
  };

  handleUsernameEdited = (event, value) => {
    this.setState({name: value});
  };

  handlePayPalIdEdited = (event, value) => {
    var tutorInfo = this.state.tutorInfo;
    tutorInfo.paypalId = value;
    this.setState({tutorInfo: tutorInfo});
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
    browserHistory.push("/account")
  };
  render() {
    if (!this.props.currentUser || !this.props.bio || !this.props.tutorInfo) {
      return <div />
    }

    var profileDiv = {
      "text-align": "center",
      "width": "50%",
      "margin": "50px auto 30px auto",
      "padding": "15px",
    };

    var formGroup = {
      "text-align": "left",
      "width": "75%",
      "margin": "10px auto 10px auto",
      "padding": "5px",
    };

    const styles = {
      exampleImageInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
      },
    };

    const stylesCheckbox = {
      cursor: 'pointer',
      width: '330px',
      margin: 'auto'
    };

    /*var pic = ((this.props.currentUser.photoUrl)? this.props.currentUser.photoUrl : "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png");
    var name = ((this.props.currentUser.displayName)? this.props.currentUser.displayName : "");
    var bio = ((this.props.bio)? this.props.bio : this.state.bio);*/
    var pic = ((this.props.currentUser.photoUrl)? this.props.currentUser.photoUrl : "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png");
    var name = ((this.props.currentUser.displayName)? this.state.name : "");
    var bio = ((this.props.bio)? this.state.bio : "");

    let tutorForm;

    if (this.state.isTutor) {
      tutorForm = (
          <div>
              <TutorForm
                  isMathChecked={this.isMathChecked}
                  isScienceChecked={this.isScienceChecked}
                  isEnglishChecked={this.isEnglishChecked}
                  isSpanishChecked={this.isSpanishChecked}
                  isHistoryChecked={this.isHistoryChecked}
                  handlePaySlider={this.handlePaySlider}
                  handlePayPalIdEdited={this.handlePayPalIdEdited}
                  paySlider={this.state.tutorInfo.payrate}
                  math={this.state.tutorInfo.math}
                  science={this.state.tutorInfo.science}
                  english={this.state.tutorInfo.english}
                  spanish={this.state.tutorInfo.spanish}
                  history={this.state.tutorInfo.history}
                  paypalId={this.state.tutorInfo.paypalId}/>
          </div>
      )
    } else tutorForm = (
        <div/>
    );

    return (
      <div style={profileDiv}>
        <form id="frmProfile">
          <h2>Edit Profile Page</h2>
            <img id="profile_img" src={pic} alt="Profile Image" width="150px" height="150px" />
            <h3>{name}</h3>
            <FlatButton label="Choose an Image" labelPosition="before">
                <input type="file" style={styles.exampleImageInput}/>
            </FlatButton>
            <div>
              <h3>About Me</h3>
                <TextField
                  value={name}
                  floatingLabelText="Change User name"
                  onChange={this.handleUsernameEdited} />
            </div>
            <TextField
              floatingLabelText="Edit Bio"
              style={{textAlign: 'left'}}
              multiLine={true}
              value={bio}
              onChange={this.handleBioEdited}
            />
            <ChangePassword/>
            <Checkbox
                ref="tutor" labelPosition="left"
                label="Would you like to become a tutor?"
                style={stylesCheckbox}
                onCheck={this.isTutorChecked}
                checked={this.state.isTutor} />
            {tutorForm}
            <RaisedButton
              label="Save"
              style={styles.submit}
              primary={true}
              onClick={this.onFormSubmit}/>
        </form>
        <Snackbar
            open={this.state.open}
            message="Your profile has been saved!"
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }

}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, updateUser, fetchBio, saveBio, fetchTutorInfo, saveTutorInfo, fetchIsTutor, saveIsTutor}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, bio: state.bio, tutorInfo: state.tutorInfo, isTutor: state.isTutor};
}


export default connect(mapStateToProps, mapDispatchToProps)(UserAccount);
