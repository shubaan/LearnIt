import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {registerUser} from '../../actions/firebase_actions';

class UserRegister extends Component {

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      name: '',
      nameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      isTutor: false
    }
  }

  isValidName(name) {
    if (name == "") {
      this.setState({name: name, nameError: "This field is Required"})
      return false
    }
    this.setState({name: name, nameError: ""})
    return true
  }

  isValidEmail(email) {
    if (email == "") {
      this.setState({email: email, emailError: "This field is Required"})
      return false
    }
    if (!email.includes('@') || !email.includes('.')) {
      this.setState({email: email, emailError: "Invalid email"})
      return false
    }
    this.setState({email: email, emailError: ""})
    return true
  }

  isValidPassword(password) {
    if (password == "") {
      this.setState({password: password, passwordError: "This field is Required"})
      return false
    }
    if (password.length < 6) {
      this.setState({password: password, passwordError: "Must be at least 6 characters"})
      return false
    }
    this.setState({password: password, passwordError: ""})
    return true
  }

  onFormSubmit() {
    let ne = this.state.nameError;
    let ee = this.state.emailError;
    let pe = this.state.passwordError;
    let hasErrors = (ne != "" || ee != "" || pe != "")
    let n = this.isValidName(this.state.name);
    let e = this.isValidEmail(this.state.email);
    let p = this.isValidPassword(this.state.password);
    let isValid = n && e && p;

    if (!hasErrors && isValid) {
        this.props.registerUser({
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          isTutor: this.state.isTutor
        }).then(data => {
            if (data.payload.errorCode)
              this.setState({message: data.payload.errorMessage});
            else
              browserHistory.push('/account');
          }
        )
    }
  }

  isTutorChecked()
  {
    console.log(!this.state.isTutor);
    this.setState({isTutor: !this.state.isTutor})
  }

  handleNameChange = (event) => {
    let n = event.target.value
    console.log(n)
    this.isValidName(n)
  };

  handleEmailChange = (event) => {
    let e = event.target.value
    console.log(e)
    this.isValidEmail(e)
  };

  handlePasswordChange = (event) => {
    let p = event.target.value
    console.log(p)
    this.isValidPassword(p)
  };

  render() {
    if (this.props.currentUser && this.props.currentUser.uid) {
      this.props.logoutUser().then(data=> {
        // reload props from reducer
        this.props.fetchUser();
      });
    }

    var registerDiv = {
      "text-align": "center",
      "width": "50%",
      "margin": "50px auto 30px auto",
      "padding": "15px",
    }

    var formGroup = {
      "text-align": "left",
      "width": "60%",
      "margin": "10px auto 10px auto",
      "padding": "5px",
    }

    var tutor = {
      "margin-right": "5px",
    }
    const styles = {
      block: {
        maxWidth: 250,
      },
      checkbox: {
        margin: "15px auto 15px auto",
        maxWidth: 200
      },
    };
    return (
      <div style={registerDiv}>
        <form id="frmRegister">
          <h2>Register</h2>
          <TextField
            onChange={this.handleNameChange}
            errorText={this.state.nameError}
            floatingLabelText="Name"/>
          <br />
          <TextField
            onChange={this.handleEmailChange}
            errorText={this.state.emailError}
            floatingLabelText="Email"/>
          <br />
          <TextField
            onChange={this.handlePasswordChange}
            floatingLabelText="Password"
            errorText={this.state.passwordError}
            type="password"/>
          <br />
          <Checkbox
            ref="tutor" labelPosition="left"
            label="Are you a tutor?"
            style={styles.checkbox}
            onCheck={this.isTutorChecked.bind(this)}/>
          <RaisedButton label="Register" primary={true} onClick={this.onFormSubmit}/>

        </form>
      </div>
    )
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    registerUser
  }, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};

}

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);
