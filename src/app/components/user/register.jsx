import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {registerUser} from '../../actions/firebase_actions';

class UserRegister extends Component {

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      message: ''
    }

  }

  onFormSubmit(event) {
    event.preventDefault();

    var name = this.refs.name.value;
    var email = this.refs.email.value;
    var password = this.refs.password.value;
    var isTutor = this.refs.tutor.checked;
    this.props.registerUser({
      name: name,
      email: email,
      password: password,
      isTutor: isTutor
    }).then(data => {

        if (data.payload.errorCode)
          this.setState({message: data.payload.errorMessage});
        else
          browserHistory.push('/account');

      }
    )

  }

  render() {

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

    return (
      <div style={registerDiv}>
        <form id="frmRegister" role="form" onSubmit={this.onFormSubmit}>
          <p>{this.state.message}</p>
          <h2>Register</h2>
          <div style={formGroup} >
            <label>Name</label>
            <input type="text" className="form-control" ref="name" id="txtName" placeholder="Name"/>
          </div>
          <div style={formGroup} >
            <label htmlFor="txtRegEmail">Email</label>
            <input type="email" className="form-control" ref="email" id="txtEmail" placeholder="Email"/>
          </div>
          <div style={formGroup} >
            <label htmlFor="txtRegPass">Password</label>
            <input type="password" className="form-control" ref="password" id="txtPass" placeholder="Password"/>
          </div>
          <div style={formGroup} >
            <label style={tutor}>Are you a tutor?</label>
            <input type="checkbox" ref="tutor" id="chkTutor"/>
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
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
