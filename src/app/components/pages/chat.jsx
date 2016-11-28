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

    this.fetchTheirProfile = this.fetchTheirProfile.bind(this)
    this.fetchMyProfile = this.fetchMyProfile.bind(this)
    this.fetchTheirMessages = this.fetchTheirMessages.bind(this)
    this.fetchMyMessages = this.fetchMyMessages.bind(this)
    this.renderMessages = this.renderMessages.bind(this)
    this.insertMessageSorted = this.insertMessageSorted.bind(this);
    this.handleSendMessageClick = this.handleSendMessageClick.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this)
  }

  componentDidMount() {
    let theirId = this.props.theirId
    FireBaseTools.fetchProfile(theirId, this.fetchTheirProfile);
    FireBaseTools.fetchProfile(this.props.currentUser.uid, this.fetchMyProfile);
    FireBaseTools.fetchMyMessages(this.props.sid, theirId, this.fetchMyMessages);
    FireBaseTools.fetchTheirMessages(this.props.sid, theirId, this.fetchTheirMessages);
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
          uid: this.props.theirId
        }
        this.insertMessageSorted(m)
    }

    fetchTheirProfile(profile) {
        this.setState({theirProfile: profile})
    }

    fetchMyProfile(profile) {
        this.setState({myProfile: profile})
    }

    insertMessageSorted(m) {
      let tmp = this.state.messages
      var i = 0
      while (i < tmp.length && tmp[i].time < m.time) { i++ }
      tmp.splice(i, 0, m)
      this.setState({ messages: tmp })
    }

    handleSendMessageClick() {
      if(this.state.message == "") {
        return;
      } else {
        let uid = this.props.theirId
        FireBaseTools.sendMessage(this.props.sid, uid, this.state.message)
        this.setState({ message: "" })
      }
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
      let p = isMe ? this.state.myProfile : this.state.theirProfile
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
      width: "25%",
      height: "500px",
      padding: "10px",
      marginTop: '-620px'
    }

    let messageStyle = {
      width: "100%",
      height: "500px",
      overflowY: "scroll",
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
          /><RaisedButton label="Send" onClick={this.handleSendMessageClick} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
