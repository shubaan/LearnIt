import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';

class Live extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    var box = {
      width: '450px',
      height: '450px',
      display: 'inline-block',
      border: '1px solid black',
    }
    var peer = new Peer({key: 'uqi67zp0j54s4i'});
    var video_self = (<video style={box} id="video-self" className="video-self" autoPlay></video>)
    var video_call = (<video style={box} id="video-call" className="video-call" autoPlay></video>)
    var video_id;
    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      video_id = id
      console.log("Video ID")
      console.log(video_id)
    });
    
    var dataConnection = peer.connect(video_id)
    console.log(dataConnection)
    dataConnection.on('on', function(data){
      console.log("Data Connected")
    })

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia({video: true, audio: true}, function(stream) {
      var call = peer.call(video_id, stream);
      var video = document.getElementById('video-self');
      dataConnection.send(stream);
      video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });

    peer.on('call', function(mediaConnection) {
      var video = document.getElementById('video-call');
      video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    });
    



    return ( 
      <div>
        {video_self}
        {video_call}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(Live);
