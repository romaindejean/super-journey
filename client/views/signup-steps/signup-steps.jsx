import React, { Component } from 'react';
import './_signup-steps.sass';
import Button from '../../components/button/button';
import { Link } from 'react-router-dom';

export default class SignUpSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      role: { Donor: false, 'Non-Profit Organisation': false },
    }
    this.clickPrevHandler = this.clickPrevHandler.bind(this);
    this.clickNextHandler = this.clickNextHandler.bind(this);
  }

  clickPrevHandler() {
    const { step } = this.state;
    this.setState({
      step: step-1
    });
  }

  clickNextHandler() {
    const { step } = this.state;
    this.setState({
      step: step+1
    });
  }

  render() {
    const { match } = this.props;
    console.log('match', match);
    return  (
      <div className="signup-steps-container">
        <h1>SignUpSteps</h1>
        <section>
          <h2>Who are you?</h2>
          <Button value="Donor"/>
          <Button value="Non-Profit Organisation"/>
        </section>
        <section className="signup-steps-button-container">
          <Link to={`${match.url}/step${this.state.step}`}><Button clickHandler={this.clickPrevHandler} value="Prev"/></Link>
          <Link to={`${match.url}/step${this.state.step}`}><Button clickHandler={this.clickNextHandler} value="Next"/></Link>
        </section>
      </div>
    );
  }
}




