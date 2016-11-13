import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';

class Live extends Component {

  constructor(props) {
    super(props);
    var peer = new Peer({key: 'uqi67zp0j54s4i'});
    var video_id = 12;
    console.log(peer);
    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      video_id = id
      console.log("Video ID")
      console.log(video_id)
    });
    var conn = peer.connect(video_id);
    conn.on('open', function(){
      console.log("Send")
      conn.send('hi!');
    });
    peer.on('connection', function(conn) {
      conn.on('data', function(data){
        console.log("Receive")
        // Will print 'hi!'
        console.log(data);
      });
    });
  }


  render() {
    var box = {
      width: '450px',
      height: '450px',
      display: 'inline-block',
      border: '1px solid black',
    }
    var peer = new Peer({key: 'uqi67zp0j54s4i'});
    var video_self = (<video style={box} className="video-self" autoPlay></video>)
    var video_call = (<video style={box} className="video-call" autoPlay></video>)
    var video_id = 112
    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      video_id = id
      console.log("Video ID")
      console.log(video_id)
    });
    
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia({video: true, audio: true}, function(stream) {
      var call = peer.call(video_id, stream);
      console.log("Calling");
      console.log(call);
      var video = document.querySelector('.video-self');
      video.src = window.URL.createObjectURL(stream);
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });


    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    peer.on('call', function(call) {
      navigator.getUserMedia({video: true, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream. 
        call.on('stream', function(remoteStream) {
          // Show stream in some <video> element. 
          var video = document.querySelector('.video-call');
          video.src = window.URL.createObjectURL(stream);
        });
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
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
