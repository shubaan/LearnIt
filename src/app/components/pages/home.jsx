import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import SplashScreen from '../helpers/splash_screen'
import SessionCard from '../helpers/session_cards'

class Home extends Component {

  constructor(props) {
    super(props);
  }

  renderSessions(tutor, tutorIMG, student, date, time, cost) {
    return <SessionCard tutor={tutor} tutorIMG={tutorIMG} student={student} date={date} time={time} cost={cost} />
  }

  render() {
    if (this.props.currentUser && this.props.currentUser.uid) {
      var homeContainer = {
        padding: '5px 15px 5px 15px',
      };
      var homeTitle = {
        margin: '0px',
        padding: '0px',
      }
      var sessionContainer = {
        justifyContent: 'space-between',
      }

      var img = "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png"

      return (
        
        <div style={homeContainer}>
          <h2 style={homeTitle}>Upcoming Sessions:</h2>
          <div style={sessionContainer} >
            {this.renderSessions('Matt', img, 'Shubaan', 'Mon, Oct 17, 2016', '18:00 PST', '$0')}
            {this.renderSessions('Matt', img, 'Shubaan', 'Mon, Oct 17, 2016', '18:00 PST', '$0')}
            {this.renderSessions('Matt', img, 'Shubaan', 'Mon, Oct 17, 2016', '18:00 PST', '$0')}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <SplashScreen/>
        </div>
      );
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
