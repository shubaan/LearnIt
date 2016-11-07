import FireBaseTools from '../../utils/firebase';
import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchMessages, sendMessage}  from '../../actions/firebase_actions';

import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

//http://localhost:3000/tutor_profile?id=1hzTChuk5TXRRelDAgeJCmfu49T2

class TutorSession extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      message: ""
    }

    this.insertMessageSorted = this.insertMessageSorted.bind(this);
    this.handleSendMessageClick = this.handleSendMessageClick.bind(this);
    this.fetchMyMessages = this.fetchMyMessages.bind(this);
    this.fetchTheirMessages = this.fetchTheirMessages.bind(this);

    FireBaseTools.fetchMyMessages(this.getTutorID(), this.fetchMyMessages);
    FireBaseTools.fetchTheirMessages(this.getTutorID(), this.fetchTheirMessages);
  }

  componentDidMount() {
    //this.props.fetchMessages(this.getTutorID());
  }

  componentDidUpdate(prevProps) {

    var ml = document.getElementById("messageList");
    ml.scrollTop = ml.scrollHeight;
  }

  fetchMyMessages(message, time) {
      console.log(message)
      let m = {
        text: message,
        time: time,
        uid: this.props.currentUser.uid
      }
      this.insertMessageSorted(m)
  }

  fetchTheirMessages(message, time) {
      console.log(message)
      let m = {
        text: message,
        time: time,
        uid: this.getTutorID()
      }
      this.insertMessageSorted(m)
  }
  //
  // insertMessageSorted(m) {
  //   let comparator = function(a, b) {
  //     let d1 = a.time
  //     let d2 = b.time
  //     return d2.localeCompare(d2);
  //   };
  //   let tmp = this.state.messages
  //   tmp.push(m)
  //   tmp.sort(comparator)
  //   this.setState({ messages: tmp })
  // }

  insertMessageSorted(m) {
    let tmp = this.state.messages
    var i = 0
    while (i < tmp.length && tmp[i].time < m.time) { i++ }
    tmp.splice(i, 0, m)
    this.setState({ messages: tmp })
  }

  getTutorID () {
    return window.location.search.substring(4)
  }

  getProfile (profiles, id) {
    for (var p in profiles){
      if (p == id)
        return profiles[p];
    }
  }

  handleSendMessageClick() {
    let uid = this.getTutorID()
    FireBaseTools.sendMessage(uid, this.state.message)
    this.setState({ message: "" })
  }


  handleMessageChange = (event) => {
    let e = event.target.value
    this.setState({ message: e })
  };

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
      let p = this.getProfile(this.props.profiles, messages[m].uid)
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
    var id = this.getTutorID()
    var tutor = this.getProfile(this.props.profiles, id);
    if (!tutor) {
      return (<h1>Error, User not Found</h1>);
    }

    let containerStyle = {
      float: "right",
      width: "400px",
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
