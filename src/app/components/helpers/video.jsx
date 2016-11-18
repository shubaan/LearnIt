import React, { Component } from 'react';

export class Video extends Component {
  constructor(props) {
    super(props);
    var id = 123456;
    this.state =  {
      hash: id,
      peer: new Peer(id, {key: 'uqi67zp0j54s4i'})
    };
  }

  componentDidMount() {
    navigator.getUserMedia = (
      navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia
    );

    this.state.peer.on('open', (id) => console.log('Peer ID: ' + id));
    this.state.peer.on('call', this.onReceiveCall.bind(this));
    this.prepareSelfVideo();

    var url = window.location.href;
    var match = url.match(/#(.+)/);
    if (match != null) {
      this.setState({caller:true});
      this.call(match[1]);
    }
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
        var call = this.state.peer.call(id, stream);
        console.log("calling..");
        call.on('stream', this.onReceiveStream);
      }, (err) => console.log(err));
  }

  componentWillUnmount() {
    this.state.peer.disconnect();
  }

  render() {
    return (
      <div className="container">
        <nav>
          Video Chat
        </nav>
        <div className="video-container">
          <video className="video-call" autoPlay></video>
          <video className="video-self" autoPlay></video>
          <div className="share">
            <a>Share - {"http://mertkahyaoglu.github.io/video-chat/#"+this.state.hash}</a>
          </div>
        </div>
        <footer>
          Made by <a target="_blank" href="http://mertkahyaoglu.github.io">Mert Kahyaoğlu</a>
        </footer>
      </div>
    );
  }
}