import React, {Component} from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loginUser, logoutUser, loginWithProvider} from '../../actions/firebase_actions';
import Snackbar from 'material-ui/Snackbar';




class UserLogin extends Component {

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.loginWithProvider = this.loginWithProvider.bind(this);
    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      open: false
    }
  }

  loginWithProvider(provider) {
    //console.log("provider :", provider);
    this.props.loginWithProvider(provider).then(data=> {
      //console.log("After login in provider : ", data);

      if (data.payload.errorCode)
        this.setState({message: data.payload.errorMessage})
      else {
        browserHistory.push('/');
      }

    });
    // alert("login with provider");
  }

  onFormSubmit() {
    this.props.loginUser({email: this.state.email, password: this.state.password}).then(data => {

        if (data.payload.errorCode)
        {
          this.setState({message: data.payload.errorMessage})
          this.setState({open: true})
        }
        else {
          browserHistory.push('/');
        }
      }
    )

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

  handleEmailChange = (event) => {
    let e = event.target.value
    //console.log(e)
    this.isValidEmail(e)
  };

  handlePasswordChange = (event) => {
    let p = event.target.value
    //console.log(p)
    this.isValidPassword(p)
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    var loginDiv = {
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

    var invalidLogin = {
      "color": "red"
    }

    return (
      <div style={loginDiv}>
        <form id="frmLogin" >
          <h2>Login</h2>
          <TextField
            ref="email"
            onChange={this.handleEmailChange}
            floatingLabelText="Email"/>
          <br />
          <TextField
            ref="password"
            onChange={this.handlePasswordChange}
            floatingLabelText="Password"
            type="password"/>
          <br />
          <br />
          <RaisedButton label="Login" primary={true} onClick={this.onFormSubmit}/>
          <Snackbar
            open={this.state.open}
            message="Invalid Login"
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose}
          />
          <br />
          <h5><Link to="/reset">Forgot password?</Link></h5>
          <br/>
          <br/>
          <h4>Login with</h4>


          <IconButton tooltip="Login with Facebook" onClick={ ()=> {
            this.loginWithProvider("facebook")} }>
            <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-512.png"
              width="40px" height="40px"/>
          </IconButton>
          <IconButton tooltip="Login with Google" onClick={ ()=> {
            this.loginWithProvider("google")} }>
            <img src="https://www.seeklogo.net/wp-content/uploads/2015/09/new-google-favicon-logo-200x200.png"
              width="40px" height="40px"/>
          </IconButton>
          <IconButton tooltip="Login with Twitter" onClick={ ()=> {
            this.loginWithProvider("twitter")} }>
            <img src="https://www.seeklogo.net/wp-content/uploads/2011/08/twitter-bird-icon-logo-vector-400x400.png"
              width="40px" height="40px"/>
          </IconButton>

        </form>
      </div>

    )
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loginUser,
    logoutUser,
    loginWithProvider,
  }, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};

}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);
