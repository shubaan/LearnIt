import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FireBaseTools from '../../utils/firebase';

class SessionCard extends Component {

  constructor(props) {
    super(props);
    this.state = {shadow: 1};
    this.goToSession = this.goToSession.bind(this)
    this.fetchTutorProfile = this.fetchTutorProfile.bind(this)
    this.fetchStudentProfile = this.fetchStudentProfile.bind(this)
  }

  componentDidMount() {
    FireBaseTools.fetchProfile(this.props.tutorId, this.fetchTutorProfile);
    FireBaseTools.fetchProfile(this.props.studentId, this.fetchStudentProfile);
  }

  fetchTutorProfile(profile) {
      this.setState({tutorProfile: profile})
  }
  fetchStudentProfile(profile) {
      this.setState({studentProfile: profile})
  }

  onMouseOver() {
    this.setState({shadow: 3});
  }
  onMouseOut() {
    this.setState({shadow: 1});
  }
  //
  // goToLive () {
  //   browserHistory.push("/live");
  // }

  goToSession () {
    browserHistory.push("/tutor_session?id="+this.props.sid);
  }

  render() {

    var cardStyle = {
      display: 'inline-block',
      width: '375px',
      height: '200px',
      margin: '15px',
    }

    var cardHeader = {
    	marginBottom: '5px',
    }

	  var imgStyle = {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      marginTop: '20px',
      display: 'inline-block',
      padding: '15px',
    }

    var title = {
    	display: 'inline-block',
    	marginLeft: '20px',
    	marginTop: '10px',
    	marginBottom: '0px',
    }

    var left = {
    	float: 'left',
    	clear: 'left',
    	marginLeft: '30px',
    }

    var right = {
    	float: 'right',
    	clear: 'right',
    	marginRight: '30px',

    }

    if (!this.state.tutorProfile || !this.state.studentProfile) {
      return <div>Loading...</div>
    }

    var date = new Date(this.props.time);
    var cost = "$"+this.state.tutorProfile.tutorInfo.payrate+" per hour";

	return (
		<Card style={cardStyle}
          onClick={this.goToSession.bind(this)}
          onMouseOver={this.onMouseOver.bind(this)}
          onMouseOut={this.onMouseOut.bind(this)}
          zDepth={this.state.shadow}>
			<div style={cardHeader}>
				<img style={imgStyle} src={this.state.tutorProfile.photoUrl} alt="Tutor Profile" />
				<h4 style={title}>Tutor: {this.state.tutorProfile.name}</h4>
			</div>
			<div>
      	<p style={left}>
          Student: {this.state.studentProfile.name}
        </p>
      	<p style={right}>
          Time: {date.toLocaleTimeString()}
        </p>
      </div>
      <div>
      	<p style={left}>
          Date: {date.toLocaleDateString()}
        </p>
				<p style={right}>
          Cost: {cost}
        </p>
			</div>
		</Card>
	);
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionCard);
