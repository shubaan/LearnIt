import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import TutorCard from '../helpers/tutor_cards'

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const SORTBY = {
  NAME: 'name',
  HOURLY: 'hourly rate',
  RATING: 'rating'
};

  const imgStyle = {
    width: '45px',
    height: '45px',
    margin: '10px'
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
      searchSubject: "",
      searchName: "",
      sortBy: SORTBY.NAME
    }
  }

  handleUpdateInput = (value) => {
    this.setState({
      searchSubject: value,
    });
  };

  handleChange = (event) => {
    this.setState({
      searchName: event.target.value,
    });
  };

  handleRadioChange = (event, value) => {
    this.setState({
      sortBy: value,
    });
  };

  render() {
    if (!this.props.currentUser || !this.props.currentUser.uid) {
      browserHistory.push("/login")
    }

    let style = {
      width: "80%",
      margin: "0px auto 0px auto"
    }

    var obj = this.props.profiles;
    //wait to get profiles from firebase
    if (!obj)
      return <div></div>;
    var libraries = Object.keys(obj).map(function (key) {
      var p = obj[key];
      p.key = key;
      return p;
    });
    var searchSubject = this.state.searchSubject.trim().toUpperCase();
    var searchName = this.state.searchName.trim().toUpperCase();

    // We are searching. Filter the results.
    libraries = libraries.filter(function(l){
      if (!l.isTutor)
        return false;
      var isSubject = true;
      var isName = true;
      if (searchSubject.length > 0 && l.tutorInfo) {
        switch(searchSubject){
          case "MATH": isSubject = l.tutorInfo.math;
            break;
          case "SCIENCE": isSubject = l.tutorInfo.science;
            break;
          case "ENGLISH": isSubject = l.tutorInfo.english;
            break;
          case "SPANISH": isSubject = l.tutorInfo.spanish;
            break;
          case "HISTORY": isSubject = l.tutorInfo.history;
            break;
          default : isSubject = false;
        }
      }
      if (searchName.length > 0 && l.name)
        isName = l.name.toUpperCase().match(new RegExp(searchName, "i"));

      return (isName && isSubject);
    });

    //sort the results
    var comparator;
    switch(this.state.sortBy){
      case SORTBY.NAME: comparator = function(a, b) {
        let aName = (a.name) ? (a.name) : "";
        let bName = (b.name) ? (b.name) : "";
        return aName.localeCompare(bName);
      };
        break;
      case SORTBY.HOURLY: comparator = function(a, b) {
        let aPay = (a.tutorInfo.payrate) ? (a.tutorInfo.payrate) : 0;
        let bPay = (b.tutorInfo.payrate) ? (b.tutorInfo.payrate) : 0;
        return aPay-bPay;
      };
        break;
      case SORTBY.RATING: comparator = function(a, b) {
        let aRating = (a.tutorInfo.rating) ? (a.tutorInfo.rating) : 0;
        let bRating = (b.tutorInfo.rating) ? (b.tutorInfo.rating) : 0;
        return bRating-aRating;
      };
        break;
      default : comparator = function(a, b) {
        return 0;
      };
    }
    libraries.sort(comparator);

    var tutor_container = {
      maxWidth: "840px",
      marginLeft: "auto",
      marginRight: "auto",
      width: "90%",
      minWidth: "280px",
      textAlign: "center",
    }

    return (
      <div style={style}>
        <TextField
          floatingLabelText="Search for tutors by name"
          onChange={this.handleChange}
        />
        <br />
        <AutoComplete
          hintText="Search for tutors by subject"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={subjects}
          onNewRequest  ={this.handleUpdateInput}
          onUpdateInput={this.handleUpdateInput}
          openOnFocus={true}
        />
        <RadioButtonGroup
          name="sortBy"
          defaultSelected={this.state.sortBy}
          onChange={this.handleRadioChange}>
          <RadioButton
            value={SORTBY.NAME}
            label="Sort by name"
          />
          <RadioButton
            value={SORTBY.HOURLY}
            label="Sort by hourly rate"
          />
          <RadioButton
            value={SORTBY.RATING}
            label="Sort by rating"
          />
        </RadioButtonGroup>
        <div style={tutor_container}>
            { libraries.map(function(l, i) {
              return <TutorCard
                key={l.key}
                profile = {l}
                profileIMG = {l.photoUrl}
                uid = {i} />} ) }
        </div>
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
