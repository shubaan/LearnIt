import React, {Component} from 'react';
import firebase from '../../utils/firebase';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, updateUser}  from '../../actions/firebase_actions';
import ChangePassword from './change_password';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

class UserAccount extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: ''
    }
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    var email = this.refs.email.value;
    var displayName = this.refs.displayName.value;
    this.props.updateUser({email: email, displayName: displayName}).then(data => {

        if (data.payload.errorCode)
          this.setState({message: data.payload.errorMessage})
        else
          this.setState({
            message: "Updated successfuly!"
          })

      }
    )
  }

  isTutorChecked()
  {
    console.log(!this.state.isTutor);
    if (this.props.currentUser.profile) {
      this.props.currentUser.profile.istutor = !this.props.currentUser.profile.isTutor
      this.setState({isTutor: !this.state.isTutor})
    }
  }

  render() {
    var profile = {};
    if (!this.props.currentUser || !this.props.currentUser.uid) {
      return <div />;
    } else if (this.props.currentUser.profile)
    {
      console.log(this.props.currentUser.profile);
      profile = this.props.currentUser.profile;
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

    var pic = ((this.props.currentUser.photoUrl)? this.props.currentUser.photoUrl : "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png");
    var name = ((this.props.currentUser.displayName)? this.props.currentUser.displayName : "No name");
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
              label="Math"
              style={styles.checkbox}
              onCheck={this.isTutorChecked.bind(this)}/>

          <div style={formGroup}>
            <label htmlFor="email">Email: </label>
            <input type="text" defaultValue={this.props.currentUser.email}
                   className="form-control" id="email" ref="email" placeholder="Email" name="email"/>
          </div>
          <div style={formGroup}>
            <label htmlFor="displayName">Display name: </label>
            <input type="text" defaultValue={this.props.currentUser.displayName}
                   className="form-control" ref="displayName" id="displayName" placeholder="Display name"
                   name="displayName"/>
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
        <ChangePassword/>
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
