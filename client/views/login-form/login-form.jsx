import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InputField from '../../components/input-field/input-field';
import Button from '../../components/button/button';
import { userLoginRequest } from '../../actions/auth/authActions';
import './_login-form.sass';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInputFieldValue: '',
      passwordInputFieldValue: '',
      emailFieldIncomplete: false,
      passwordFieldIncomplete: false,
    }
    this.inputFieldChangeHandler = this.inputFieldChangeHandler.bind(this);
    this.submitLoginHandler = this.submitLoginHandler.bind(this);
  }

  inputFieldChangeHandler = e => {
    if (e.target.type === 'email') {
      let newEmailValue = e.target.value;
      this.setState({
        emailInputFieldValue: newEmailValue
      });
    } else if (e.target.type === 'password') {
      let newPasswordValue = e.target.value;
      this.setState({
        passwordInputFieldValue: newPasswordValue
      });
    }
  }

  submitLoginHandler() {
    const props = this.state;    
    if (this.state.emailInputFieldValue === '' && this.state.passwordInputFieldValue === '') {
      this.setState({
        emailFieldIncomplete: true,
        passwordFieldIncomplete: true
      });
    } else if (this.state.emailInputFieldValue === '') {
      this.setState({
        emailFieldIncomplete: true,
        passwordFieldIncomplete: false
      });
    } else if (this.state.passwordInputFieldValue === '') {
      this.setState({
        emailFieldIncomplete: false,
        passwordFieldIncomplete: true
      });
    } else {
      const { userLoginRequest } = this.props;
      const user = {
        email: this.state.emailInputFieldValue,
        password: this.state.passwordInputFieldValue
      };
      userLoginRequest(user)
    }
  }

  render() {
    return (
      <div className="login-form-container">
        <div className="login-form-field-container">
          <InputField
            placeholderText="Email address"
            type="email"
            changeHandler={this.inputFieldChangeHandler}
            value={this.state.emailInputFieldValue}
            containerStyleClassName="login-form-input-field"
          />
          {this.state.emailFieldIncomplete ?
            <span className="login-error-message">* Email field required</span>
            : null
          }
        </div>
        <div className="login-form-field-container">
          <InputField
            placeholderText="Password"
            type="password"
            changeHandler={this.inputFieldChangeHandler}
            value={this.state.passwordInputFieldValue}
            containerStyleClassName="login-form-input-field"
          />
          {this.state.passwordFieldIncomplete ?
            <span className="login-error-message">* Password field required</span>
            : null
          }
        </div>
        <Button
          value="Login"
          styleClassName="button-primary"
          clickHandler={this.submitLoginHandler}
        />
      </div>
    )
  }
}

LoginForm.propTypes = {
  userLoginRequest: React.PropTypes.func.isRequired
}

const matchDispatchToProps = dispatch => bindActionCreators({userLoginRequest: userLoginRequest}, dispatch)

export default connect(null, matchDispatchToProps)(LoginForm);


