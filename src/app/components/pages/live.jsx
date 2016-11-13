import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';

const key_value = 'uqi67zp0j54s4i';

class Live extends Component {

  constructor(props) {
    super(props);
    this.peer = new Peer({key: key_value})
  }

  start() {
    navigator.getUserMedia = (
      navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia
    );
    var video_id
    this.peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      video_id = id
      console.log("Video ID")
      console.log(video_id)
    });
    this.peer.on('call', this.onReceiveCall.bind(this));
    this.prepareSelfVideo();
    console.log("Video ID");
    console.log(this.video_id);
    this.call(this.video_id);
  }

  getMedia(options, success, error) {
    navigator.getUserMedia(options, success, error);
  }

  onReceiveCall(call) {
    this.getMedia({audio: true, video: true}, (stream) => {
      console.log("answering..");
      call.answer(stream)
    }, (err) => console.log(err));

    call.on('stream', (stream) => {
      var video = document.querySelector('video');
      video.src = window.URL.createObjectURL(stream);
    });
  }

  onReceiveStream(stream) {
    console.log("streaming")
    var video = document.querySelector('.video-call');
    video.src = window.URL.createObjectURL(stream);
  }

  prepareSelfVideo() {
    this.getMedia({audio: false, video: true}, (stream) => {
        var video = document.querySelector('.video-self');
        video.src = window.URL.createObjectURL(stream);
      }, (err) => console.log(err));
  }

  call(id) {
    this.getMedia({audio: true, video: true}, (stream) => {
        var call = this.peer.call(id, stream);
        console.log("calling..");
        call.on('stream', this.onReceiveStream(stream));
      }, (err) => console.log(err));
  }

  componentWillUnmount() {
    this.peer.disconnect();
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

    this.start();



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
