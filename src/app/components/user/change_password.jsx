import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changePassword} from '../../actions/firebase_actions';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'

class ChangePassword extends Component {

  constructor(props) {

    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      message: '',
      password: '',
      repeatPassword: '',
      errorMessage: ''
    }
  }

  onFormSubmit(event) {
    event.preventDefault();
    var password = this.state.password
    var repeatPassword = this.state.repeatPassword
    if (password !== repeatPassword) {
      this.setState({
        message: "Please password must match!",
        errorMessage: "Passwords do not match"
      })
    }
    else {
      this.props.changePassword(password).then(data => {
        if (data.payload.errorCode) {
          this.setState({
            errorMessage:data.payload.errorMessage})
        }
        else {
          this.setState({message: "Password was changed!"})
          console.log(this.state.message)
        }
      })
    }
  }

  passwordTextChanged = (event, value) => {
    this.setState({password: value});

  };
  repeatPasswordTextChanged = (event, value) => {
    this.setState({repeatPassword: value});

  };


  render() {

    var changePassword = {
      "width": "75%",
      "margin":"40px auto 0px auto",
    }

    var formGroup = {
      "text-align": "left",
      "margin": "10px auto 10px auto",
      "padding": "5px",
    }

    var profileDiv = {
      "text-align": "center",
      "width": "50%",
      "margin": "50px auto 30px auto",
      "padding": "15px",
    };

    const styles = {
      block: {
        maxWidth: 250,
      },
      submit: {
        margin: "15px auto 15px auto",
        maxWidth: 200
      },
    };

    return (
      <form style = {changePassword} id="ChangePassword" role="form" onSubmit={this.onFormSubmit}>
        <h3> Change Password </h3>
        <div>
          <TextField
            value={this.state.password}
            errorText={this.state.errorMessage}
            onChange={this.passwordTextChanged}
            floatingLabelText="New Password"
            type="password"/>
        </div>
        <div>
          <TextField
            value={this.state.repeatPassword}
            errorText={this.state.errorMessage}
            onChange={this.repeatPasswordTextChanged}
            floatingLabelText="Repeat Password"
            type="password"/>
        </div>
        <RaisedButton
          label="Change Password"
          style={styles.submit}
          primary={true}
          onClick={this.onFormSubmit}/>
      </form>
    )
  }

}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({changePassword}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};

}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
