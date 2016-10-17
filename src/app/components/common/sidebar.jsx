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
      focused: this.props.link.indexOf(location.pathname)
    };

    //this code is to add a timer to update the component if we can't get global state working
    this.updateFocus = this.updateFocus.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.updateFocus, 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateFocus() {
    this.setState({focused: this.props.link.indexOf(location.pathname)});

  }

  clicked(index) {
    // The click handler will update the state with
    // the index of the focused menu entry
    browserHistory.push(this.props.link[index]);
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
