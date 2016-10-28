import React, {Component} from 'react';
import firebase from '../../utils/firebase';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, updateUser}  from '../../actions/firebase_actions';
import ChangePassword from './change_password';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import TutorForm from './tutor_form';
import Snackbar from 'material-ui/Snackbar';

class UserAccount extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: '',
      profile: {}
    }
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {

      console.log(nextProps);
      var profile = {};
      if (nextProps.currentUser && nextProps.currentUser.uid) {
       if (nextProps.currentUser.profile) {
          console.log(nextProps.currentUser.profile);
          this.setState({profile: nextProps.currentUser.profile});
        }
      }
  }

  onFormSubmit(event) {
    event.preventDefault();
    let user = this.props.currentUser;
    user.profile = this.state.profile;
    this.props.updateUser(user);
    this.setState({
        open: true,
    });
  }

  isTutorChecked()
  {
    console.log(!this.state.profile.isTutor);
    var profile = this.state.profile;
    profile.isTutor = !this.state.profile.isTutor
    this.setState({profile: profile})
  }

  isMathChecked()
  {
    console.log(!this.state.profile.math);
    var profile = this.state.profile;
    profile.math = !this.state.profile.math
    this.setState({profile: profile})
  }

  isScienceChecked()
  {
    console.log(!this.state.profile.science);
    var profile = this.state.profile;
    profile.science = !this.state.profile.science
    this.setState({profile: profile})
  }

  isEnglishChecked()
  {
    console.log(!this.state.profile.english);
    var profile = this.state.profile;
    profile.english = !this.state.profile.english
    this.setState({profile: profile})
  }

  isSpanishChecked()
  {
    console.log(!this.state.profile.spanish);
    var profile = this.state.profile;
    profile.spanish = !this.state.profile.spanish
    this.setState({profile: profile})
  }

  isHistoryChecked()
  {
    console.log(!this.state.profile.history);
    var profile = this.state.profile;
    profile.history = !this.state.profile.history
    this.setState({profile: profile})
  }

  handlePaySlider = (event, value) => {
    var profile = this.state.profile;
    profile.payrate = value
    this.setState({profile: profile})
   };
    handleBioEdited = (event, value) =>
    {
        var profile = this.state.profile
        profile.bio = value
        this.setState({profile: profile})
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };
  render() {
    if (!this.props.currentUser || !this.props.currentUser.uid) {
      return <div />
    } else if (this.props.currentUser.profile && this.state.profile == {}) {
      console.log("update profile state")
      this.setState({profile: this.props.currentUser.profile});
    }
    var profileDiv = {
      "text-align": "center",
      "width": "50%",
      "margin": "50px auto 30px auto",
      "padding": "15px",
    }

    var formGroup = {
      "text-align": "left",
      "width": "75%",
      "margin": "10px auto 10px auto",
      "padding": "5px",
    }

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

    var pic = ((this.state.profile.photoUrl)? this.state.profile.photoUrl : "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png");
    var name = ((this.state.profile.displayName)? this.state.profile.name : "");


    let tutorForm;
    if (this.state.profile.isTutor) {
      tutorForm = (
          <div>
              <TutorForm
                  isMathChecked={this.isMathChecked.bind(this)}
                  isScienceChecked={this.isScienceChecked.bind(this)}
                  isEnglishChecked={this.isEnglishChecked.bind(this)}
                  isSpanishChecked={this.isSpanishChecked.bind(this)}
                  isHistoryChecked={this.isHistoryChecked.bind(this)}
                  handlePaySlider={this.handlePaySlider.bind(this)}
                  handleBioEdited={this.handleBioEdited.bind(this)}
                  paySlider={this.state.profile.payrate}
                  math={this.state.profile.math}
                  science={this.state.profile.science}
                  english={this.state.profile.english}
                  spanish={this.state.profile.spanish}
                  history={this.state.profile.history}
                  bio={this.state.profile.bio}/>
          </div>
      )
    } else tutorForm = (
        <div/>
        )


    return (
      <div style={profileDiv}>
        <form id="frmProfile">
          <h2>Edit Profile Page</h2>
            <img id="profile_img" src={pic} alt="Profile Image" width="150px" height="150px" />
            <h3>{name}</h3>
            <FlatButton label="Choose an Image" labelPosition="before">
              <input type="file" style={styles.exampleImageInput}/>
            </FlatButton>
            <Checkbox
                ref="tutor" labelPosition="left"
                label="Would you like to become a tutor?"
                style={styles.checkbox}
                onCheck={this.isTutorChecked.bind(this)}
                defaultChecked={this.state.profile.isTutor}/>
            {tutorForm}
            <RaisedButton label="Save" style={styles.submit} primary={true} onClick={this.onFormSubmit}/>
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
  return bindActionCreators({fetchUser, updateUser}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}


export default connect(mapStateToProps, mapDispatchToProps)(UserAccount);
