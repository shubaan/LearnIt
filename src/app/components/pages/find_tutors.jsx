import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';

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

  const subjects = [
    'Math',
    'Science',
    'English',
    'Spanish',
    'History'
  ];

class FindTutors extends Component {

  constructor(props) {
    super(props);
    this.props.fetchProfiles();
    this.state = {
      search: "",
    }
  }

  handleSearchChange = (event) => {
    let s = event.target.value
    console.log(s)
    this.setState({search: s});
  };

  handleUpdateInput = (value) => {
    this.setState({
      search: value,
    });
  };

  renderProfileNames(profiles) {
    if (profiles)
    {

      console.log(this.state.search);
      var rows = [];
      for (var p in profiles){
        let filter;
        let profile = profiles[p];
        switch(this.state.search.toUpperCase()){
          case "MATH": filter = profile.math;
            break;
          case "SCIENCE": filter = profile.science;
            break;
          case "ENGLISH": filter = profile.english;
            break;
          case "SPANISH": filter = profile.spanish;
            break;
          case "HISTORY": filter = profile.history;
            break;
          default : filter = profile.isTutor;
        }
        let image = ((profile.photoUrl)? profile.photoUrl : "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png")
        if (filter) {
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
    if (!this.props.currentUser || !this.props.currentUser.uid) {
      browserHistory.push("/login")
    }

    let style = {
      width: "80%",
      margin: "0px auto 0px auto"
    }
    return (
      <div style={style}>
        <h2>Available Tutors</h2>
        <AutoComplete
          hintText="Search for tutors by subject"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={subjects}
          onNewRequest  ={this.handleUpdateInput}
          onUpdateInput={this.handleUpdateInput}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(FindTutors);