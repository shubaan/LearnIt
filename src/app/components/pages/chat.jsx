import FireBaseTools from '../../utils/firebase';
import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchMessages, sendMessage}  from '../../actions/firebase_actions';

import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';


class Chat extends Component {

  constructor(props) {
    super(props);

    if (!this.props.currentUser) {
      browserHistory.push("/")
      return
    }

    this.state = {
      messages: [],
      message: "",
      theirId: 0
    }

    this.renderMessages = this.renderMessages.bind(this)
  }

  componentDidMount() {
  }


  componentDidUpdate(prevProps) {

    var ml = document.getElementById("messageList");
    ml.scrollTop = ml.scrollHeight;
  }

  renderMessages()
  {
    if (!this.state.messages) {
      console.log("no messages ")
      return <div />
    }

    let cardStyle = {
      margin: "5px"
    }

    let myStyle = {
      textAlign: "right",
      color: "blue"

    }

    let theirStyle = {
      textAlign: "left",
      color: "green"
    }

    let myDivStyle = {
      width: "100%",
      textAlign: "right",
      display: "inline-block",
      padding: "10px",
      color: "blue"
    }


    let theirDivStyle = {
      display: "inline-block",
      width: "100%",
      textAlign: "left",
      padding: "10px",
      color: "green"
    }

    let imgStyle = {
      margin: "0px 5px 0px 5px"
    }

    let messages = this.state.messages
    let items = []
    for (var m in messages) {
      let isMe = messages[m].uid == this.props.currentUser.uid
      let p = this.state.theirProfile
      let user
      if (isMe) {
        user = (
          <div style={myDivStyle}>
            <label>{p.name}</label>
            <img style={imgStyle} src={p.photoUrl} width="30px" height="30px" />
          </div>
        )
      } else {
        user = (
          <div style={theirDivStyle}>
            <img style={imgStyle} src={p.photoUrl} width="30px" height="30px" />
            <label>{p.name}</label>
          </div>
        )
      }
      items.push(
      <div key={m}>
        {user}
        <Card style={cardStyle} >
          <CardText style={isMe ? myStyle : theirStyle}>
            {messages[m].text}
          </CardText>
        </Card>
      </div>
      )
    }
    return <div>{items}</div>
  }

  render() {

    let containerStyle = {
      float: "right",
      width: "300px",
      height: "100%",
      padding: "10px"
    }

    let messageStyle = {
      width: "100%",
      height: "500px",
      overflow: "auto",
      margin: "0px auto 0px auto",
    }



    return (
        <div style={containerStyle}>
          <div style={messageStyle} id="messageList" >{this.renderMessages()}</div>
          <TextField
            hintText="Enter Message"
            fullWidth={true}
            value={this.state.message}
            onChange={this.handleMessageChange}
          />
          <RaisedButton label="Send" onClick={this.handleSendMessageClick} />
        </div>
    );


  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchMessages, sendMessage}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, profiles: state.profiles, messages: state.messages};
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorSession);
