import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';

class Student extends Component {

  constructor(props) {
    super(props);
    this.props.fetchProfiles();
  }

  renderProfileNames(profiles) {
    if (profiles)
    {
      var rows = [];
      for (var p in profiles){
        if (profiles[p].isTutor) {
          let item = <li key={p}>{profiles[p].name}</li>;
          rows.push(item);
        }
      }
      return <ul> {rows} </ul>;
    }
    return <div>no profiles</div>;
  }

  render() {
    return (
      <div>
        student page
        {this.renderProfileNames(this.props.profiles)}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchProfiles}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, profiles: state.profiles};
}

export default connect(mapStateToProps, mapDispatchToProps)(Student);
