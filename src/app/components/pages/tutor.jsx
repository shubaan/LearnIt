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
        {/* Tutor Page
        <h1>This is the tutor page</h1> */}
        <Header/>
        <Content/>
        <Table/>
        <Button/>
      </div>
    );
  }
}

class Button extends Component{
  render(){
    return(
      <div>
        <button>Request session</button>
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
      "align":"center",
      "margin": "0",
      "padding": "5px 10px",
      "outline": "1px solid black"
    }
    return(
      <div>
        <table style={tableStyle}>
          <tr>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Monday</th>
            <th style={thStyle}>Tuesday</th>
            <th style={thStyle}>Wednesday</th>
            <th style={thStyle}>Thrusday</th>
            <th style={thStyle}>Friday</th>
            <th style={thStyle}>Saturday</th>
        </tr>
        <tr>
            <th>09:00 - 10:00</th>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
            <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th>10:00 - 11:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th>11:00 - 12:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        <tr>
            <th>12:00 - 13:00</th>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
              <td style={thStyle}>xxxxxx</td>
        </tr>
        </table>
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
