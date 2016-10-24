import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';
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
            message: 'Message'
        };
        this.subjectChange = this.subjectChange.bind(this);
        this.messageChange = this.messageChange.bind(this);
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
                    + document.getElementById("message").value)
        browserHistory.push("/messagesent");
        
    }

    render() {
        var container = {
            width: '50%',
            margin: '20px auto 0px auto',
        };
        return (
            <div style={container}>
                <div>
                    <TextField
                        id = "subject"
                        floatingLabelText={"Subject"}
                        onChange={this.subjectChange} />
                </div>
                <div>
                    <TextField id="message"
                        floatingLabelText={"Message"}
                        multiLine={true}
                        onChange={this.messageChange}/>
                </div>
                <div>
                    <RaisedButton name="submit"
                        onClick={this.submitClickListener}>Submit</RaisedButton>
                </div>
            </div>
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
