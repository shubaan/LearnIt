import React, {Component} from 'react';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser, registerUser} from '../../actions/firebase_actions';
import TutorForm from './tutor_form';

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
      isTutor: false,
      paySlider: 50,
      math: false,
      science: false,
      english: false,
      spanish: false,
      history: false,
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
        let user = {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          isTutor: this.state.isTutor
        }
        if (user.isTutor) {
          user.math = this.state.math;
          user.science = this.state.science;
          user.english = this.state.english;
          user.spanish = this.state.spanish;
          user.history = this.state.history;
          user.payrate = this.state.paySlider;
        }
        this.props.registerUser(user).then(data => {
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

  isMathChecked()
  {
    console.log(!this.state.math);
    this.setState({math: !this.state.math})
  }

  isScienceChecked()
  {
    console.log(!this.state.science);
    this.setState({science: !this.state.science})
  }

  isEnglishChecked()
  {
    console.log(!this.state.english);
    this.setState({english: !this.state.english})
  }

  isSpanishChecked()
  {
    console.log(!this.state.spanish);
    this.setState({spanish: !this.state.spanish})
  }

  isHistoryChecked()
  {
    console.log(!this.state.history);
    this.setState({history: !this.state.history})
  }

  handlePaySlider = (event, value) => {
     this.setState({paySlider: value});
   };

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
        margin: "15px auto 0px auto",
        maxWidth: 200
      },
      submit: {
        margin: "15px auto 15px auto",
        maxWidth: 200
      },
    };

    let tutorForm;
    if (this.state.isTutor) {
      tutorForm = (
        <TutorForm
          isMathChecked={this.isMathChecked.bind(this)}
          isScienceChecked={this.isScienceChecked.bind(this)}
          isEnglishChecked={this.isEnglishChecked.bind(this)}
          isSpanishChecked={this.isSpanishChecked.bind(this)}
          isHistoryChecked={this.isHistoryChecked.bind(this)}
          handlePaySlider={this.handlePaySlider.bind(this)}
          paySlider={this.state.paySlider}
          math={this.state.math}
          science={this.state.science}
          english={this.state.english}
          spanish={this.state.spanish}
          history={this.state.history} />
      )
    } else tutorForm = <div />

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
          {tutorForm}
          <RaisedButton label="Register" style={styles.submit} primary={true} onClick={this.onFormSubmit}/>

        </form>
      </div>
    )
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchUser, logoutUser, registerUser
  }, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};

}

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);
