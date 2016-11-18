import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

/* idk what this is, so i'm going to just leave it.
*  love, Dan
*/
  const divStyle = {
    width: "500px",
    height: "500px",
    overflowY: "auto",
    background: "white",
    margin: "0px auto 0px auto",
  };


class ContactUs extends Component {
  constructor(props) {
      super(props);
      this.state = {
          subject: 'Subject',
          message: 'Message',
          sent: false
      };
      this.subjectChange = this.subjectChange.bind(this);
      this.messageChange = this.messageChange.bind(this);
      this.submitClickListener = this.submitClickListener.bind(this)
  }

  subjectChange(event) {
      this.setState({subject: event.target.value});
  }
  messageChange(event) {
      this.setState({message: event.target.value});
  }
  submitClickListener() {
    //TODO: does nothing yet...
    console.log("subject: "
      + document.getElementById("subject").value
      + "\nmessage: "
      + document.getElementById("message").value);
    this.setState({sent: true});
  }
  returnHome() {
    browserHistory.push("")
  }

  render() {
    var container = {
      width: '50%',
      margin: '20px auto 0px auto',
    };

    var divStyle = {
      "text-align": "center",
      "width": "50%",
      "margin": "50px auto 30px auto",
      "padding": "15px",
    };

    var submitStyle = {
      margin: "15px auto 15px auto",
      maxWidth: 200
    }

  let contactUs;
  if(!this.state.sent) {
    console.log("not sent")
    contactUs = (
      <div style={divStyle}>
        <div>
          <TextField
            id="subject"
            floatingLabelText={"Subject"}
            onChange={this.subjectChange}/>
        </div>
        <div>
          <TextField
            id="message"
            style={{textAlign: 'left'}}
            floatingLabelText={"Message"}
            multiLine={true}
            onChange={this.messageChange}/>
        </div>
        <div>
          <RaisedButton
            name="submit"
            style={submitStyle}
            onClick={this.submitClickListener}
            label="Submit"/>
        </div>
      </div>
    );
  }
  else {
    console.log("sent");
    contactUs =
      (
        <div style={divStyle}>
          <p>Your message has been submitted!</p>
          <RaisedButton
            onClick={this.returnHome}
            style={submitStyle}
            label="Return Home"/>
        </div>
      )
  }
    return (
      contactUs
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
