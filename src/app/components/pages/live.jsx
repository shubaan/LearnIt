import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';

const key_value = 'uqi67zp0j54s4i';

class Live extends Component {

  constructor(props) {
    super(props);
    this.my_id = 12
    this.other_id = 1212
    this.peer = new Peer(this.my_id, {key: key_value})
  }

  start() {
    navigator.getUserMedia = (
      navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia
    );

    this.peer.on('open', (id) => console.log('Peer ID: ' + id));
    this.peer.on('call', this.onReceiveCall.bind(this));
    this.prepareSelfVideo();
    this.call(this.other_id);
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
    var video = document.getElementById('video-call');
    video.src = window.URL.createObjectURL(stream);
  }

  prepareSelfVideo() {
    this.getMedia({audio: false, video: true}, (stream) => {
        var video = document.getElementById('video-self');
        video.src = window.URL.createObjectURL(stream);
      }, (err) => console.log(err));
  }

  call(id) {
    this.getMedia({audio: true, video: true}, (stream) => {
        var call = this.peer.call(id, stream);
        console.log("calling..."+id);
        call.on('stream', this.onReceiveStream);
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
