import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchProfiles}  from '../../actions/firebase_actions';
import RaisedButton from 'material-ui/RaisedButton';

  const divStyle = {
    width: "500px",
    height: "500px"
  };


class SplashScreen extends Component {
    constructor(props) {
        super(props);
    }

    handleRegisterClick() {
        browserHistory.push("/register");
    }

    handleTourClick(){
        browserHistory.push("/register");
    }
    render() {
        var paraStyle={
          marginTop:'20px',
          marginBottom:'20px'
        }
        var homeStyle={
          marginTop:"150px",
          marginLeft:"100px"
        }
        var imageStyle={
          marginTop:"80px",
          width:"300px",
          height:"435px"
        }
        var tutorSessionImage={
          marginTop:"30px",
          width:'500px',
          height:'535px'
        }
        var liveSesssionImage={
          marginTop:'60px',
          width:"500px",
          height:'300px'
        }
        var scheduleHeader={
          marginTop:'40px'
        }
        var tutorImage={
          marginTop:"60px",
          width:"500px",
          height:'202px'
        }
        var textStyle={
          marginTop:"100px",
          marginBottom:"50px"
        }
        var title={
          paddingTop:"90px",
          paddingBottom:"50px",
          textAlign:"center"
        }
        var buttonStyle={
          marginTop: "80px",
          marginLeft: "80px",
          width: "150px",
          textColor:"black"
        }
        var buttonStyle1={
          marginTop: "80px",
          width: "150px",
          textColor:"black"
        }
        var homeButton={
          marginLeft:"200px"
        }
        return (
            <div>
                <div>
                    <section id="HOME">
                      <div className="section_overlay">
                        <div className="container">
                          <div className="row">
                            <div className="col-md-8 col-sm-8">
                              <div style={homeStyle} className="homeText">
                                <h1>Welcome To LearnIt</h1>
                                <h2>Online Tutoring Made Easy</h2>
                              <div>
                                    <RaisedButton label="REGISTER" primary={true} style={buttonStyle1} onClick={this.handleRegisterClick}/>
                                    <RaisedButton label="TAKE A TOUR" style={buttonStyle} backgroundColor="orange" href="#ABOUT"/>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-3 col-md-offset-1 col-sm-4">
                              <div>
                                <img style={imageStyle} src="src/app/components/images/logo.png"></img>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                </div>

                <section id="ABOUT">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-10 col-md-offset-1">
                        <div style={title}>
                          <h1>ABOUT US</h1>

                          <h2>Tutors at the click of a button</h2>

                          <p style={paraStyle}>
                              With <b>LearnIt</b>, you can learn any subject quickly and easily.
                          </p>
                          <p style={paraStyle}>
                              With our experienced tutors, you can get help at your convenience any time, anywhere.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </section>

                <section id="tutor">
                  <div className="container">
                    <div className="row">
                      <div>

                      </div>
                      <div className="col-md-6">
                        <div id="tutorPaidImage">
                          <img src="http://i.imgur.com/30mfMvJ.png" style={tutorImage}></img>
                        </div>
                        <div style={scheduleHeader}>
                          <h3>Flexible Scheduling</h3>
                          <p style={paraStyle}>You make your own schedule! </p>
                          <p style={paraStyle}>You can browse through a list of tutors to see their availability and schedule a time that works for you.
                              Whether you are a morning person or a night owl, there will a tutor for you waiting for you to schedule a session.</p>
                        </div>

                        <div>
                          <h3>Interactive Sessions</h3>
                          <p style={paraStyle}>
                            We use state-of-the-art online white board and chat section so that tutors
                            and students can interact with each other in real-time</p>
                        </div>

                      </div>
                      <div className="col-md-6">
                        <div id="tutor" style={divStyle}>
                          <h2>WHY WE ARE BEST FOR YOU</h2>

                          <div>
                            <h3>Professional-level Tutors</h3>
                            <p style={paraStyle}>We pick the best tutors on the market so that you can get the best help possible.</p>
                            <p style={paraStyle}>You choose your own tutor! You can look at reviews other students have given to make your decision.</p>
                          </div>

                          <div>
                            <img src="http://i.imgur.com/YMEPrvb.png" style={liveSesssionImage}></img>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="container" style={textStyle}>
                    <div className="row">
                      <div className="col-md-6">
                        <div>
                          <img src="http://i.imgur.com/owZQ8OE.png" style={tutorSessionImage}></img>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div id="beingTutor">
                          <h2>
                              Interested in being a tutor?
                          </h2>
                          <p style={paraStyle}>
                              You set your schedule, make your own rate and get paid directly from students
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>


                <section className="copyright">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-8">
                        <p>Copyright &copy; 2016. All Rights Reserved.</p>
                        <p>Team LearnIt</p>
                      </div>
                      {/* <div className="col-md-4"></div> */}
                      <div className="col-md-4">
                        <RaisedButton backgroundColor="orange" label="^" href="#HOME" style={homeButton}></RaisedButton>
                      </div>
                    </div>
                  </div>

                </section>

            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
