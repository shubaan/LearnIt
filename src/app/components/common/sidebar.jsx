import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser}  from '../../actions/firebase_actions';

class Sidebar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style="border: 1px solid black; padding: 10px;">
        <h3 style="display: inline-block; padding: 5px; margin: 10px 0px 0px 5px;">
          Sidebar
          <hr style="margin: 3px 0px 5px 0px;"/>
        </h3>
        <ol>
          {this.props.list.map(function(listValue){
            return <li>{listValue}</li>;
          })}
        </ol>

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
