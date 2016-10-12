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
    console.log("requested");
    // this.setState({
    //   isClicked: true
    // })
  }

  render(){
    var divStyle={
      "textAlign":"center"
    }
    return(
      <div style={divStyle}>
        <button  onClick={this.handleClick.bind(this)}>Request session</button>
      </div>
    );
  }
}


class Table extends Component{

  handleTableClick(){

      // // console.log("table clicked");
      var table = document.getElementById("table");
      for(var i = 0; i< table.rows.length; i++){
        for(var j = 0; j< table.rows[i].cells.length; j++){
          table.rows[i].cells[j].onclick = (function (i, j) {
                return function () {
                    alert('R' + (i) + 'C' + (j));
                };
            }(i, j));
        }
      }
  }

  render(){
    var tableStyle={
      "outline": "1px solid black",
      "border": "1px solid black",
      "cursor":"pointer"
    };

    var thStyle={
      // "background-color": "green",
      "textAlign":"center",
      "margin": "0",
      "padding": "5px 10px",
      "outline": "1px solid black",
      "backgroundColor":"gray",
      "width": "150px"
    }
    var tdStyle={
      // "background-color": "green",
      "align":"center",
      "margin": "0",
      "padding": "5px 10px",
      "outline": "1px solid black"
    }
    return(
      <div>
        <table style={tableStyle} id="table" onClick={this.handleTableClick.bind(this)}>
          <tbody id="tbody">
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
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>10:00 - 11:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>11:00 - 12:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>12:00 - 13:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>13:00 - 14:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>14:00 - 15:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>15:00 - 16:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>16:00 - 17:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>17:00 - 18:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>18:00 - 19:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
        </tr>
        <tr>
            <th style={thStyle}>19:00 - 20:00</th>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
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
