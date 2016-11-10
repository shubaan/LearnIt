import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class SessionCard extends Component {

  constructor(props) {
    super(props);
    this.state = {shadow: 1};
  }

  onMouseOver() {
    this.setState({shadow: 3});
  }
  onMouseOut() {
    this.setState({shadow: 1});
  }

  goToLive () {
    browserHistory.push("/live");
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

	return (
		<Card style={cardStyle}
          onClick={this.goToLive.bind(this)}
          onMouseOver={this.onMouseOver.bind(this)}
          onMouseOut={this.onMouseOut.bind(this)}
          zDepth={this.state.shadow}>
			<div style={cardHeader}>
				<img style={imgStyle} src={this.props.tutorIMG} alt="Tutor Profile" />
				<h4 style={title}>Tutor: {this.props.tutor}</h4>
			</div>
			<div>
	        	<p style={left}>Student: {this.props.student}</p>
	        	<p style={right}>Time: {this.props.time}</p>
	        </div>
	        <div>
	        	<p style={left}>Date: {this.props.date}</p>
				<p style={right}>Cost: {this.props.cost}</p>
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
