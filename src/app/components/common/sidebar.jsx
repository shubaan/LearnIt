import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../../actions/firebase_actions';
import './sidebar_style.css';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focused: 0
    };
  }

  clicked(index) {
    // The click handler will update the state with
    // the index of the focused menu entry
    let section = this.props.list[index].toLowerCase();
    browserHistory.push("/"+section)
    this.setState({focused: index});
  }

  render() {
    var self = this;

    return (
      <div id="sidebarContainer">
        <ul className='side'>
          {this.props.list.map(function(listValue, index){
            var style = '';
            if(self.state.focused == index){
              style = 'focused';
            }

            return <li key={index} className={style} onClick={self.clicked.bind(self, index)}>{listValue}</li>;
          })}
        </ul>
        <p>Selected: {this.props.list[this.state.focused]}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
