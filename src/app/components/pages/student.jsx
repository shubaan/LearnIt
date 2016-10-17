import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';

  const imgStyle = {
    width: '45px',
    height: '45px',
    margin: '10px'
  };

  const listStyle = {
    listStyle: 'none',
  };

  const divStyle = {
    width: "500px",
    height: "500px",
    overflowY: "auto",
    background: "white",
    margin: "0px auto 0px auto",
  };


class Student extends Component {

  constructor(props) {
    super(props);
    this.props.fetchProfiles();
  }

  renderProfiles(profile) {
    if (profile) {
      var profileContainer = {
        border: '1px solid black',
        padding: '15px',
        margin: '10px 10px 10px 10px',
        display: 'inline-block',
        borderRadius: '10px',
      }
      var img = {
        display: 'inline-block',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        margin: '0px 20px 0px 0px'
      }
      var profileName = {
        display: 'inline-block',
        width: '150px',
      }
      var image = ((profile.photoUrl)? profile.photoUrl : "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png");

      return (
        <div style={profileContainer}>
          <img style={img} src={image} />
          <h3 style={profileName} >{profile.name}</h3>
        </div>
      );
    }
  }

  render() {
    var tutors = [];
    for (var p in this.props.profiles) {
      tutors.push( this.renderProfiles(this.props.profiles[p]) );
    }

    return (
      <div>
        <h2>Available Tutors</h2>
        {tutors}
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
