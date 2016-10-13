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

  renderProfileNames(profiles) {
    if (profiles)
    {
      var rows = [];
      for (var p in profiles){
        let profile = profiles[p];
        let image = ((profile.photoUrl)? profile.photoUrl : "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png")
        if (profile.isTutor) {
          let item =
          <li key={p} style={listStyle}>
            <img src={image} style={imgStyle}/>
            {profiles[p].name}
          </li>;
          rows.push(item);
        }
      }
      return <div style={divStyle}>
                <ul> {rows} </ul>
             </div>;
    }
    return <div></div>;
  }

  render() {
    return (
      <div>
        <p>Available Tutors</p>
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
