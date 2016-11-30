import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, fetchNotifications}  from '../../actions/firebase_actions';
import FireBaseTools from '../../utils/firebase';
import '../../css/notifications.css';
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CommunicationChat from 'material-ui/svg-icons/communication/chat'
import ActionEvent from 'material-ui/svg-icons/action/event'
import ActionDone from 'material-ui/svg-icons/action/done'
import ContentReply from 'material-ui/svg-icons/content/reply'
import ContentClear from 'material-ui/svg-icons/content/clear'
import ContentSend from 'material-ui/svg-icons/content/send'
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import Snackbar from 'material-ui/Snackbar';

let SelectableList = makeSelectable(List);

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

class Notifications extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.props.fetchNotifications();
    this.state = {
      selectedIndex: 0,
      replyOpen: false,
      messageOpen: false,
      reply: "",
      message: "",
      recipient: null,
      session: null,
      sbMessage: "",
      sbOpen: false,
    }
    this.timer = undefined;
  }

  componentWillUnMount() {
    clearTimeout(this.timer);
  }

  handleRequestChange(event, index) {
    this.setState({selectedIndex: index});
  }

  handleReplyOpen(recipient, oldMessage) {
    this.setState({
      replyOpen: true,
      recipient: recipient,
      message: oldMessage
    });
  }

  handleReplyClose() {
    this.setState({replyOpen: false, message: ""});
  }

  handleReply() {
    if (this.state.reply != "") {
      FireBaseTools.sendNotification(this.state.recipient, this.state.reply+"\n\n"+this.state.message, this.showCallback.bind(this));
      this.setState({replyOpen: false});
      this.timer = setTimeout(() => {this.props.fetchNotifications();}, 500);
    } else {
      this.setState({sbOpen: true, sbMessage: "You must enter a message to send"});
    }
  }

  handleReplyChange(event) {
    this.setState({
      reply: event.target.value,
    });
  }

  handleMessageOpen(recipient) {
    this.setState({messageOpen: true, recipient: recipient});
  }

  handleMessageClose() {
    this.setState({messageOpen: false});
  }

  handleMessage() {
    if (this.state.message != "") {
      FireBaseTools.sendNotification(this.state.recipient, this.state.message, this.showCallback.bind(this));
      this.setState({messageOpen: false});
      this.timer = setTimeout(() => {this.props.fetchNotifications();}, 500);
    } else {
      this.setState({sbOpen: true, sbMessage: "You must enter a message to send"});
    }
  }

  handleMessageChange(event) {
    this.setState({
      message: event.target.value,
    });
  }

  handleAccept(notification) {
    FireBaseTools.acceptSession(notification.senderId, notification.request, notification.key, this.showCallback.bind(this));
    this.timer = setTimeout(() => {this.props.fetchNotifications();}, 500);
  }

  handleReject(notification) {
    FireBaseTools.rejectSession(notification.senderId, notification.request, notification.key, this.showCallback.bind(this));
    this.timer = setTimeout(() => {this.props.fetchNotifications();}, 500);
  }

  handleSnackbarClose() {
    this.setState({sbOpen: false});
  }

  showCallback(result) {
    this.setState({sbOpen: true, sbMessage: result.message});
  }

  getCardHeader(notification) {
    var date = new Date(notification.timestamp);
    switch(notification.type){
      case "message":
        return <CardHeader
          title={"Message from "+notification.senderName}
          subtitle={"Sent "+date.toLocaleString()}
          avatar={notification.senderPhoto}
        />;
        break;
      case "notification":
        return <CardHeader
          title={notification.senderName}
          subtitle={"Sent "+date.toLocaleString()}
          avatar="http://i.imgur.com/xLGaGy8.png"
        />;
        break;
      case "request":
        return <CardHeader
          title={"Tutoring request from "+notification.senderName}
          subtitle={"Sent "+date.toLocaleString()}
          avatar={notification.senderPhoto}
        />;
        break;
      default :
        return <CardHeader />;
    }
  }

  getCardText(notification) {
    switch(notification.type){
      case "message":
        return <CardText>
          <div id="withprewrap">{notification.message}</div>
        </CardText>;
        break;
      case "notification":
        return <CardText>
          <div id="withprewrap">{notification.message}</div>
        </CardText>;;
        break;
      case "request":
        var date = new Date(notification.request.startTime);
        var end = new Date(notification.request.endTime);
        return <CardText>
          <h3>{notification.message}</h3>
          <p><b>Time: </b>On {days[date.getDay()]}, {date.toLocaleDateString()} from {date.toLocaleTimeString()} to {end.toLocaleTimeString()}</p>
          <p><b>Subject: </b>{notification.request.subject}</p>
          <p><b>Description: </b>{notification.request.description}</p>
        </CardText>;
        break;
      default :
        return <CardText />;
    }
  }

  getCardActions(notification) {
    switch(notification.type){
      case "message":
        var date = new Date(notification.timestamp);
        var oldMessage = "On "+days[date.getDay()]+", "+date.toLocaleDateString()+" at "+date.toLocaleTimeString()+", "+
          notification.senderName+" wrote:\n>"+notification.message.replace(/\n/g, '\n>');
        return <CardActions>
          <FlatButton
            label="Reply"
            onTouchTap={this.handleReplyOpen.bind(this, notification.senderId, oldMessage)}
            icon={<ContentReply />} />
        </CardActions>;
        break;
      case "notification":
        return <CardActions />;
        break;
      case "request":
        return <CardActions>
          <FlatButton
            label="Message"
            onTouchTap={this.handleMessageOpen.bind(this, notification.senderId)}
            icon={<ContentSend />} />
          <FlatButton
            label="Accept"
            primary={true}
            onTouchTap={this.handleAccept.bind(this, notification)}
            icon={<ActionDone />}
            disabled={notification.answered ? true : false}/>
          <FlatButton
            label="Reject"
            secondary={true}
            onTouchTap={this.handleReject.bind(this, notification)}
            icon={<ContentClear />}
            disabled={notification.answered ? true : false}/>
        </CardActions>;
        break;
      default :
        return <CardActions />;
    }
  }

  render() {
    const replyActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleReplyClose.bind(this)}
      />,
      <FlatButton
        label="Send"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleReply.bind(this)}
      />,
    ];
    const messageActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleMessageClose.bind(this)}
      />,
      <FlatButton
        label="Send"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleMessage.bind(this)}
      />,
    ];

    var getIcon = function(type) {
      switch(type){
        case "message":
          return <CommunicationChat />;
          break;
        case "notification":
          return <CommunicationChatBubble />;
          break;
        case "request":
          return <ActionEvent />;
          break;
        default :
          return <CommunicationChatBubble />;
      }
    };

    if (!this.props.currentUser || !this.props.currentUser.uid) {
      return <LinearProgress mode="indeterminate" />;
    }

    var obj = this.props.notifications ? this.props.notifications : {};
    var inbox = Object.keys(obj).map(function (key) {
      var p = obj[key];
      p.key = key;
      return p;
    });
    inbox.reverse();
    if (inbox.length < 1) {
      inbox.push({
        timestamp: Date.now(),
        type: "notification",
        senderName: "LearnIt",
        senderId: "abc",
        senderPhoto: "http://i.imgur.com/xLGaGy8.png",
        message: "No messages"
      });
    }
    /*/test
    var u = this.props.currentUser;
    if (!u)
      return <div>Notifications</div>
    inbox.push({
      timestamp: Date.now(),
      type: "message",
      senderName: u.displayName,
      senderId: u.uid,
      senderPhoto: u.photoURL,
      message: "Message 1"
    });
    inbox.push({
      timestamp: Date.now(),
      type: "notification",
      senderName: "LearnIt",
      senderId: u.uid,
      senderPhoto: u.photoURL,
      message: "Notification 1"
    });
    //endtest*/
    return (
      <div id="notifications">
        <Card id="notification_list">
          <SelectableList value={this.state.selectedIndex} onChange={this.handleRequestChange.bind(this)}>
            <Subheader>My Notifications</Subheader>
            { inbox.map(function(l, i){
              return <ListItem
                key = {l.key}
                value = {i}
                primaryText={l.senderName}
                secondaryText={l.message}
                secondaryTextLines={1}
                leftAvatar={<Avatar src={l.type=="notification" ? "http://i.imgur.com/xLGaGy8.png": l.senderPhoto} />}
                rightIcon={getIcon(l.type)}
              />;
            }) }
          </SelectableList>
        </Card>
        <Card id="notification_details">
          {this.getCardHeader(inbox[this.state.selectedIndex])}
          {this.getCardText(inbox[this.state.selectedIndex])}
          {this.getCardActions(inbox[this.state.selectedIndex])}
        </Card>
        <Dialog
          title={"Reply to "+inbox[this.state.selectedIndex].senderName}
          actions={replyActions}
          modal={false}
          open={this.state.replyOpen}
          onRequestClose={this.handleReplyClose.bind(this)} >
          <TextField
            value={this.state.reply}
            onChange={this.handleReplyChange.bind(this)}
            floatingLabelText="Enter message here"
            multiLine={true}
            rows={2}
            fullWidth={false} />
        </Dialog>
        <Dialog
          title={"Send a message to "+inbox[this.state.selectedIndex].senderName}
          actions={messageActions}
          modal={false}
          open={this.state.messageOpen}
          onRequestClose={this.handleMessageClose.bind(this)} >
          <TextField
            value={this.state.message}
            onChange={this.handleMessageChange.bind(this)}
            floatingLabelText="Enter message here"
            multiLine={true}
            rows={2}
            fullWidth={false} />
        </Dialog>
        <Snackbar
          open={this.state.sbOpen}
          message={this.state.sbMessage}
          autoHideDuration={3000}
          onRequestClose={this.handleSnackbarClose.bind(this)}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, fetchNotifications}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser, notifications: state.notifications};
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
