import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, fetchNotifications, fetchNewNotificationNumber}  from '../../actions/firebase_actions';
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
import ContentReply from 'material-ui/svg-icons/content/reply'
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

let SelectableList = makeSelectable(List);

class Notifications extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.props.fetchNotifications();
    this.props.fetchNewNotificationNumber();
    this.state = {
      selectedIndex: 0,
      replyOpen: false,
      reply: "",
      recipient: null
    }
    this.timer = undefined;
  }

  componentWillUnMount() {
    clearTimeout(this.timer);
  }

  handleRequestChange(event, index) {
    this.setState({selectedIndex: index});
  }

  handleReplyOpen(recipient) {
    this.setState({replyOpen: true, recipient: recipient});
  }

  handleReplyClose() {
    this.setState({replyOpen: false});
  }

  handleReply() {
    FireBaseTools.sendNotification(this.state.recipient, this.state.reply);
    this.setState({replyOpen: false});
    this.timer = setTimeout(() => {this.props.fetchNotifications();}, 500);
  }

  handleChange(event) {
    this.setState({
      reply: event.target.value,
    });
  };

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

  getCardActions(notification) {
    switch(notification.type){
      case "message":
        return <CardActions>
          <FlatButton
            label="Reply"
            onTouchTap={this.handleReplyOpen.bind(this, notification.senderId)}
            icon={<ContentReply />} />
        </CardActions>;
        break;
      case "notification":
        return <CardActions />;
        break;
      case "request":
        return <CardActions>
          <FlatButton />
        </CardActions>;
        break;
      default :
        return <CardActions />;
    }
  }

  render() {
    const actions = [
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

    var obj = this.props.notifications ? this.props.notifications : {};
    var inbox = Object.keys(obj).map(function (key) { return obj[key]; });
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
                key = {i}
                value = {i}
                primaryText={l.senderName}
                secondaryText={l.message}
                leftAvatar={<Avatar src={l.type=="notification" ? "http://i.imgur.com/xLGaGy8.png": l.senderPhoto} />}
                rightIcon={getIcon(l.type)}
              />;
            }) }
          </SelectableList>
        </Card>
        <Card id="notification_details">
          {this.getCardHeader(inbox[this.state.selectedIndex])}
          <CardText>
            {inbox[this.state.selectedIndex].message}
          </CardText>
          {this.getCardActions(inbox[this.state.selectedIndex])}
        </Card>
        <Dialog
          title={"Reply to "+inbox[this.state.selectedIndex].senderName}
          actions={actions}
          modal={false}
          open={this.state.replyOpen}
          onRequestClose={this.handleReplyClose.bind(this)} >
          <TextField
            value={this.state.reply}
            onChange={this.handleChange.bind(this)}
            floatingLabelText="Enter message here"
            multiLine={true}
            rows={3}
            fullWidth={true} />
        </Dialog>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, fetchNotifications, fetchNewNotificationNumber}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser, notifications: state.notifications};
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
