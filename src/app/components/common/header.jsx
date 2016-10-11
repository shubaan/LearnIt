import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, logoutUser, fetchBio, saveBio}  from '../../actions/firebase_actions';
import './header_style.css'
import Loading  from '../helpers/loading';

class Header extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.props.fetchBio();
    super();
    this.state = {
      edit: false,
      editText: "---no edit---",
    };
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getBio(bio) {
    if (!bio) {
      this.props.fetchBio();
    }
    return bio ? bio : '';
  }

  handleEditClick() {
    this.setState({edit: !this.state.edit});
  }

  handleSubmitClick() {
    if (this.state.editText !== "---no edit---") {
      this.props.saveBio(this.state.editText)
    }
    this.setState({edit: !this.state.edit});
  }

  handleChange(e) {
    this.setState({editText: e.target.value});
  }

  render() {
    if (!this.props.currentUser) {
      return <Loading />
    }
    var headerBody;
    if (!this.state.edit) {
      headerBody = (<div>
        <p id="bio_content">{this.getBio(this.props.bio)}</p>
        <button onClick={this.handleEditClick}>Edit Bio</button>
      </div>);
    } else {
      headerBody = (<div>
        <p>
          <textarea id="bio_inputText" defaultValue={this.getBio(this.props.bio)} onChange={this.handleChange} />
        </p>
        <button onClick={this.handleSubmitClick}>Submit</button>
        <button onClick={this.handleEditClick}>Cancel</button>
      </div>);
    }
    return (
      <div id="header_div">
        <div id="profile_div">
          <img id="profile_img" src="http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png" alt="Profile Image" />
          <h3 class="title">Profile Image</h3>
          <p>Photo URL:{this.props.currentUser.photoUrl}</p>
        </div> 
        <div id="bio_div">
          <h3 class="title">About Me:</h3>
          {headerBody}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, logoutUser, fetchBio, saveBio}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, bio: state.bio};
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
