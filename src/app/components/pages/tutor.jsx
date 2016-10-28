import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../../actions/firebase_actions';
import {browserHistory, Link} from 'react-router';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

class Tutor extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Table/>
        <MyDialog/>
      </div>
    );
  }
}

class MyDialog extends Component{
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  // handle event when user clicks confirm button
  handleConfirm = () => {
    this.setState({open: false});
    browserHistory.push("/home");
  };

  // handle even when user clicks cancel button
  handleCancel = () => {
    this.setState({open: false});
    // browserHistory.push("/tutor");
  };

  render(){
    var buttonStyle={
      marginLeft:"45%"
    }
    var style={
      margin: 12,
    }
    const actions = [
      <RaisedButton
        label="Cancel"
        style={style}
        secondary={true}
        onTouchTap={this.handleCancel}
      />,
      <RaisedButton
        label="Submit"
        style={style}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleConfirm}
      />,
    ];

    return(
      <div>
        <RaisedButton style={buttonStyle} label="Request" primary={true} onTouchTap={this.handleOpen} />
        <Dialog
          title="Confirmation"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}>
          Are you sure you want to request this session?
        </Dialog>
      </div>
    );
  }
}

class Table extends Component{

  constructor(props) {
    super(props);
    this.state={
      dateTime: 'dateTime'
    };
  }

  handleTableClick(){
      var table = document.getElementById("table");
      var cells = table.getElementsByTagName("td");

      for(var i = 0; i< table.rows.length; i++){
        for(var j = 0; j< table.rows[i].cells.length; j++){
            table.rows[i].cells[j].onclick = (function (i, j) {
                return function () {
                    console.log(this.id);
                    this.style.backgroundColor=(this.style.backgroundColor=="green")?("pink"):("green");
                };
            }(i, j));
        }
      };
  }

  render(){
    var tableStyle={
      marginTop: "3%",
      marginLeft:"10%",
      outline: "1px solid black",
      border: "1px solid black",
      cursor:"pointer",
      backgroundColor:"pink"
    };

    var thStyle={
      // "background-color": "green",
      textAlign:"center",
      margin: "0",
      padding: "5px 10px",
      outline: "1px solid black",
      backgroundColor:"gray",
      width: "170px"
    }
    var tdStyle={
      // "background-color": "green",
      align:"center",
      margin: "0",
      padding: "5px 10px",
      outline: "1px solid black",
      width:"100px"
    }
    var date={
      textAlign:"center",
      width:"130px",
      backgroundColor:"gray",
      padding: "5px 10px",
      outline: "1px solid black",
    }
    return(
      <div>
        <h3>Student can request a 1-hour tutoring session with a tutor by selecting one of the time slots below</h3>
        <table style={tableStyle} id="table" onClick={this.handleTableClick.bind(this)}>
          <tbody id="tbody">
          <tr>
            <th style={thStyle}>Time</th>
            <th style={date}>Monday</th>
            <th style={date}>Tuesday</th>
            <th style={date}>Wednesday</th>
            <th style={date}>Thursday</th>
            <th style={date}>Friday</th>
            <th style={date}>Saturday</th>
            <th style={date}>Sunday</th>
        </tr>
        <tr>
            <th style={thStyle}>9:00am - 10:00am</th>
            <td id="Monday, 9:00am, 10:00am" style={tdStyle}></td>
            <td id="Tuesday, 9:00am, 10:00am" style={tdStyle}></td>
            <td id="Wednesday, 9:00am, 10:00am" style={tdStyle}></td>
            <td id="Thursday, 9:00am, 10:00am" style={tdStyle}></td>
            <td id="Friday, 9:00am, 10:00am" style={tdStyle}></td>
            <td id="Saturday, 9:00am, 10:00am" style={tdStyle}></td>
            <td id="Sunday, 9:00am, 10:00am" style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>10:00am - 11:00am</th>
            <td id="Monday, 10:00am, 11:00am" style={tdStyle}></td>
            <td id="Tuesday, 10:00am, 11:00am" style={tdStyle}></td>
            <td id="Wednesday, 10:00am, 11:00am" style={tdStyle}></td>
            <td id="Thursday, 10:00am, 11:00am" style={tdStyle}></td>
            <td id="Friday, 10:00am, 11:00am" style={tdStyle}></td>
            <td id="Saturday, 10:00am, 11:00am" style={tdStyle}></td>
            <td id="Sunday, 10:00am, 11:00am" style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>11:00am - 12:00pm</th>
            <td id="Monday, 11:00am, 12:00pm" style={tdStyle}></td>
            <td id="Tuesday, 11:00am, 12:00pm" style={tdStyle}></td>
            <td id="Wednesday, 11:00am, 12:00pm" style={tdStyle}></td>
            <td id="Thursday, 11:00am, 12:00pm" style={tdStyle}></td>
            <td id="Friday, 11:00am, 12:00pm" style={tdStyle}></td>
            <td id="Saturday, 11:00am, 12:00pm" style={tdStyle}></td>
            <td id="Sunday, 11:00am, 12:00pm" style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>12:00pm - 1:00pm</th>
            <td id="Monday, 12:00pm, 1:00pm" style={tdStyle}></td>
            <td id="Tuesday, 12:00pm, 1:00pm" style={tdStyle}></td>
            <td id="Wednesday, 12:00pm, 1:00pm" style={tdStyle}></td>
            <td id="Thursday, 12:00pm, 1:00pm" style={tdStyle}></td>
            <td id="Friday, 12:00pm, 1:00pm" style={tdStyle}></td>
            <td id="Saturday, 12:00pm, 1:00pm" style={tdStyle}></td>
            <td id="Sunday, 12:00pm, 1:00pm" style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>1:00pm - 2:00pm</th>
            <td id="Monday, 1:00pm, 2:00pm" style={tdStyle}></td>
            <td id="Tuesday, 1:00pm, 2:00pm" style={tdStyle}></td>
            <td id="Wednesday, 1:00pm, 2:00pm" style={tdStyle}></td>
            <td id="Thursday, 1:00pm, 2:00pm" style={tdStyle}></td>
            <td id="Friday, 1:00pm, 2:00pm" style={tdStyle}></td>
            <td id="Saturday, 1:00pm, 2:00pm" style={tdStyle}></td>
            <td id="Sunday, 1:00pm, 2:00pm" style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>2:00pm - 3:00pm</th>
            <td id="Monday, 2:00pm, 3:00pm" style={tdStyle}></td>
            <td id="Tuesday, 2:00pm, 3:00pm" style={tdStyle}></td>
            <td id="Wednesday, 2:00pm, 3:00pm" style={tdStyle}></td>
            <td id="Thursday, 2:00pm, 3:00pm" style={tdStyle}></td>
            <td id="Friday, 2:00pm, 3:00pm" style={tdStyle}></td>
            <td id="Saturday, 2:00pm, 3:00pm" style={tdStyle}></td>
            <td id="Sunday, 2:00pm, 3:00pm" style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>3:00pm - 4:00pm</th>
            <td id="Monday, 3:00pm, 4:00pm" style={tdStyle}></td>
            <td id="Tuesday, 3:00pm, 4:00pm" style={tdStyle}></td>
            <td id="Wednesday, 3:00pm, 4:00pm" style={tdStyle}></td>
            <td id="Thursday, 3:00pm, 4:00pm" style={tdStyle}></td>
            <td id="Friday, 3:00pm, 4:00pm" style={tdStyle}></td>
            <td id="Saturday, 3:00pm, 4:00pm" style={tdStyle}></td>
            <td id="Sunday, 3:00pm, 4:00pm" style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>4:00pm - 5:00pm</th>
            <td id="Monday, 4:00pm, 5:00pm" style={tdStyle}></td>
            <td id="Tuesday, 4:00pm, 5:00pm" style={tdStyle}></td>
            <td id="Wednesday, 4:00pm, 5:00pm" style={tdStyle}></td>
            <td id="Thursday, 4:00pm, 5:00pm" style={tdStyle}></td>
            <td id="Friday, 4:00pm, 5:00pm" style={tdStyle}></td>
            <td id="Saturday, 4:00pm, 5:00pm" style={tdStyle}></td>
            <td id="Sunday, 4:00pm, 5:00pm" style={tdStyle}></td>

        </tr>
        <tr>
            <th style={thStyle}>5:00pm - 6:00pm</th>
            <td id="Monday, 5:00pm, 6:00pm" style={tdStyle}></td>
            <td id="Tuesday, 5:00pm, 6:00pm" style={tdStyle}></td>
            <td id="Wednesday, 5:00pm, 6:00pm" style={tdStyle}></td>
            <td id="Thursday, 5:00pm, 6:00pm" style={tdStyle}></td>
            <td id="Friday, 5:00pm, 6:00pm" style={tdStyle}></td>
            <td id="Saturday, 5:00pm, 6:00pm" style={tdStyle}></td>
            <td id="Sunday, 5:00pm, 6:00pm" style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>6:00pm - 7:00pm</th>
            <td id="Monday, 6:00pm, 7:00pm" style={tdStyle}></td>
            <td id="Tuesday, 6:00pm, 7:00pm" style={tdStyle}></td>
            <td id="Wednesday, 6:00pm, 7:00pm" style={tdStyle}></td>
            <td id="Thursday, 6:00pm, 7:00pm" style={tdStyle}></td>
            <td id="Friday, 6:00pm, 7:00pm" style={tdStyle}></td>
            <td id="Saturday, 6:00pm, 7:00pm" style={tdStyle}></td>
            <td id="Sunday, 6:00pm, 7:00pm" style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>7:00pm - 8:00pm</th>
            <td id="Monday, 7:00pm, 8:00pm" style={tdStyle}></td>
            <td id="Tuesday, 7:00pm, 8:00pm" style={tdStyle}></td>
            <td id="Wednesday, 7:00pm, 8:00pm" style={tdStyle}></td>
            <td id="Thursday, 7:00pm, 8:00pm" style={tdStyle}></td>
            <td id="Friday, 7:00pm, 8:00pm" style={tdStyle}></td>
            <td id="Saturday, 7:00pm, 8:00pm" style={tdStyle}></td>
            <td id="Sunday, 7:00pm, 8:00pm" style={tdStyle}></td>
        </tr>
        </tbody>
        </table>
        <br></br>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, logoutUser}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutor);
