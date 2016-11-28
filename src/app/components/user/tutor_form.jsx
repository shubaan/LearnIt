import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField'
class TutorForm extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    const styles = {
      block: {
        maxWidth: 250,
      },
      checkbox: {
        margin: "15px auto 0px auto",
        maxWidth: 200
      },
    };
    var slider = {
      width: '300px',
      margin: 'auto',
    }

    return (
      <div>
        <h3>Tutor Subjects</h3>
        <Checkbox
          label="Math"
          style={styles.checkbox}
          checked={this.props.math}
          onCheck={this.props.isMathChecked}
        />
        <Checkbox
          label="Science"
          style={styles.checkbox}
          checked={this.props.science}
          onCheck={this.props.isScienceChecked}
        />
        <Checkbox
          label="English"
          style={styles.checkbox}
          checked={this.props.english}
          onCheck={this.props.isEnglishChecked}
        />
        <Checkbox
          label="Spanish"
          style={styles.checkbox}
          checked={this.props.spanish}
          onCheck={this.props.isSpanishChecked}
        />
        <Checkbox
          label="History"
          style={styles.checkbox}
          checked={this.props.history}
          onCheck={this.props.isHistoryChecked}
        />

        <h3>Hourly Pay Rate</h3>
        <p>
          <span>${this.props.paySlider}/hour</span>
        </p>
        <Slider
          style = {slider}
          min={0}
          max={100}
          step={1}
          value={this.props.paySlider}
          onChange={this.props.handlePaySlider}
        />
        <h3>PayPal</h3>
        <TextField
          floatingLabelText={"PayPal Email Address"}
          defaultValue={this.props.paypalId}
          onChange={this.props.handlePayPalIdEdited}
        />
    </div>
    );
  }
}

export default TutorForm;
