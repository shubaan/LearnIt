import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';

const key_value = 'uqi67zp0j54s4i';

class Live extends Component {

  constructor(props) {
    super(props);
    this.my_id = "12"
    this.other_id = "1212"
    this.peer = new Peer(this.my_id, {key: key_value})
  }

  start() {
    var peer = this.peer;
    var other_id = this.other_id;
    console.log(peer);

    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
    });

    navigator.getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    this.setup(peer);
    this.answer(peer, other_id);
    var timer = setInterval(this.call(peer,other_id), 1000)
    console.log("Timer")
    console.log(timer)
    setTimeout(function() {
      console.log(timer)
      clearInterval(timer)
      console.log("Clearing")
    }, 20000)
  }

  test(peer, other_id) {
    console.log("Test")
  }

  setup(peer) {
    //Sets up own camera
    navigator.getUserMedia({audio:false, video:true}, function(stream) {
      console.log("Streaming");
      console.log(stream);
      var video = document.getElementById("video-self");
      video.src = window.URL.createObjectURL(stream);
    }, function(err) {
      console.log("Error loading camera");
    })
  }

  call(peer, other_id) {
    navigator.getUserMedia({audio:true, video:true}, function(stream) {
      console.log("Calling stream");
      console.log(stream);
      var call = peer.call(other_id, stream);
      console.log("Calling connection");
      console.log(call);
    }, function(err) {
      console.log("Error sending stream");
    })
  }

  answer(peer, other_id) {
    peer.on('call', function(call) {
      navigator.getUserMedia({audio:true, video:true}, function(stream){

        console.log("Answering");
        call.answer(stream);
        console.log(call);
        call.on('stream', function(stream) {
          console.log("Other Stream");
          console.log(stream);
          var video = document.getElementById("video-call");
          video.src = window.URL.createObjectURL(stream);
        })
      }, function(err) {
      
      });
    })
  }

  render() {
    var box = {
      width: '450px',
      height: '450px',
      display: 'inline-block',
      border: '1px solid black',
    }
    var video_self = (<video style={box} id="video-self" className="video-self" autoPlay></video>)
    var video_call = (<video style={box} id="video-call" className="video-call" autoPlay></video>)

    this.start()

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