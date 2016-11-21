const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = React.PropTypes;
import FireBaseTools from '../../utils/firebase';

class WhiteBoard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      color: "blue",
      size: 5,
      lines: []
    }
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this)
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this)
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
    this.setColor = this.setColor.bind(this)

  }

  componentDidMount() {
    let canvas = ReactDOM.findDOMNode(this.refs.canvas);
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let ctx = canvas.getContext('2d');

    this.setState({
      canvas: canvas,
      context: ctx
    });

    FireBaseTools.fetchWhiteBoard(this.props.sid, this.draw.bind(this), this.resetCanvas.bind(this))

    this.refreshWhiteboard = this.refreshWhiteboard.bind(this)
    this.refreshWhiteboard()
  }

  refreshWhiteboard() {
        let path = {
          x1: 0,
          y1: 0,
          x2: -1,
          y2: -1,
          color: "white",
          size: 0
        }
        const that = this
        setTimeout(function(){
          that.draw(path)
          FireBaseTools.drawNewLine(that.props.sid, path)
        }, 100);
  }

  handleOnMouseDown(e) {
    let rect = this.state.canvas.getBoundingClientRect();
    if(this.isMobile()){
      this.setState({
        lastX: e.targetTouches[0].pageX - rect.left,
        lastY: e.targetTouches[0].pageY - rect.top
      });
    }
    else{
      this.setState({
        lastX: e.clientX - rect.left,
        lastY: e.clientY - rect.top
      });
    }

    this.setState({
      drawing: true
    });
  }

  handleOnMouseMove(e) {

    if(this.state.drawing) {
      let rect = this.state.canvas.getBoundingClientRect();
      let lastX = this.state.lastX;
      let lastY = this.state.lastY;
      let currentX;
      let currentY;
      if(this.isMobile()){
        currentX =  e.targetTouches[0].pageX - rect.left;
        currentY = e.targetTouches[0].pageY - rect.top;
      }
      else{
        currentX = e.clientX - rect.left;
        currentY = e.clientY - rect.top;
      }
      this.setState({
        lastX: currentX,
        lastY: currentY
      });

      let path = {
        x1: lastX,
        y1: lastY,
        x2: currentX,
        y2: currentY,
        color: this.state.color,
        size: this.state.size
      }
      //this.draw(path)
      FireBaseTools.drawNewLine(this.props.sid, path)
    }
  }

  handleOnMouseUp() {
    this.setState({
      drawing: false
    });
  }

  draw(path) {
      if (path && this.state.context) {
        this.state.context.beginPath();
        this.state.context.strokeStyle = path.color;
        this.state.context.lineWidth = path.size;
        this.state.context.moveTo(path.x1, path.y1);
        this.state.context.lineTo(path.x2, path.y2);
        this.state.context.stroke();
      }
  }

  resetCanvas() {
    let width = this.state.context.canvas.width;
    let height = this.state.context.canvas.height;
    this.state.context.clearRect(0, 0, width, height);
    FireBaseTools.deleteWhiteBoard(this.props.sid)
  }

  getDefaultStyle() {
    return {
      backgroundColor: 'white',
      cursor: 'pointer'
    };
  }

  canvasStyle() {
    let defaults =  this.getDefaultStyle();
    let custom = this.props.canvasStyle;
    return Object.assign({}, defaults, custom);
  }

  isMobile() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
    }
    return false;
  }

  setColor(color) {
    this.setState({ color: color })
  }

  render() {
    return (
      <div>
        <canvas ref="canvas"
          style = {this.canvasStyle()}
          onMouseDown = {this.handleOnMouseDown}
          onTouchStart = {this.handleOnMouseDown}
          onMouseMove = {this.handleOnMouseMove}
          onTouchMove = {this.handleOnMouseMove}
          onMouseUp = {this.handleOnMouseUp}
          onTouchEnd = {this.handleOnMouseUp}
          onMouseLeave = {this.handleOnMouseUp}
        />
        <ColorPallet color="red" setColor={this.setColor}/>
        <ColorPallet color="orange" setColor={this.setColor}/>
        <ColorPallet color="yellow" setColor={this.setColor}/>
        <ColorPallet color="green" setColor={this.setColor}/>
        <ColorPallet color="teal" setColor={this.setColor}/>
        <ColorPallet color="blue" setColor={this.setColor}/>
        <ColorPallet color="purple" setColor={this.setColor}/>
        <ColorPallet color="pink" setColor={this.setColor}/>
        <ColorPallet color="black" setColor={this.setColor}/>
        <ColorPallet color="grey" setColor={this.setColor}/>
        <ColorPallet color="white" setColor={this.setColor}/>
        <button onClick={this.resetCanvas.bind(this)}>Reset</button>
      </div>
    );
  }

}

class ColorPallet extends React.Component {
  constructor(props) {
    super(props)
    this.setColor = this.setColor.bind(this)
  }
  setColor() {
    this.props.setColor(this.props.color)
  }
  render() {
    var palletStyle = {
      width: "40px",
      height: "40px",
      float: "left",
      backgroundColor: this.props.color,
      border: "0.5px solid black",
    }
    return (
      <span style={palletStyle} onClick={this.setColor} />
    )
  }
}


module.exports = WhiteBoard;
