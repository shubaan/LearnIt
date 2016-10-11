import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../../actions/firebase_actions';

class Tutor extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {/* <Header/>
        <Content/> */}
        <Table/>
        <Button/>
      </div>
    );
  }
}

class Button extends Component{

  getInitialState(){
    return {isClicked: false};
  }

  handleClick(){
    // console.log("requested");

  }

  render(){
    return(
      <div>
        <button onClick={this.handleClick.bind(this)}>Request session</button>
        <h3 className="requestResult">{}</h3>
      </div>
    );
  }
}

class Table extends Component{

  render(){

    var tableStyle={
      "border": "1px solid black"
    };

    var thStyle={
      // "background-color": "green",
      "align":"center",
      "margin": "0",
      "padding": "5px 10px",
      "outline": "1px solid black"
    }
    return(
      <div>
        <table style={tableStyle}>
          <tbody>
          <tr>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Monday</th>
            <th style={thStyle}>Tuesday</th>
            <th style={thStyle}>Wednesday</th>
            <th style={thStyle}>Thursday</th>
            <th style={thStyle}>Friday</th>
            <th style={thStyle}>Saturday</th>
            <th style={thStyle}>Sunday</th>
        </tr>
        <tr>
            <th style={thStyle}>09:00 - 10:00</th>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>10:00 - 11:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>11:00 - 12:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>12:00 - 13:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>13:00 - 14:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>14:00 - 15:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>15:00 - 16:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>16:00 - 17:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>17:00 - 18:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>18:00 - 19:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th style={thStyle}>19:00 - 20:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        </tbody>
        </table>
        <br></br>
      </div>
    );
  }
}

class Header extends Component{
  render(){
    return(
      <div><h1>Tutor Page</h1></div>
    );
  }
}

class Content extends Component{
  render(){
    return(
      <div>
        <h2>This is the tutor page</h2>
        <p>Request session below</p>
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
