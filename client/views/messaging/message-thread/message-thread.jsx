import React, { Component } from 'react';
import './_message-thread.sass';
import Message from '../../../components/message/message';
import Button from '../../../components/button/button';
import InputField from '../../../components/input-field/input-field';
import moment from 'moment';

export default class MessageThread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInputFieldValue: ''
    }
    this.newMessageInputFieldChange = this.newMessageInputFieldChange.bind(this);
    this.sendNewMessageClicked=this.sendNewMessageClicked.bind(this);
    this.shouldDisplayTime = this.shouldDisplayTime.bind(this);
  }

  newMessageInputFieldChange(e) {
    let newMessageInputFieldValue = e.target.value;
    this.setState({
      messageInputFieldValue: newMessageInputFieldValue
    });
  }

  sendNewMessageClicked() {
    const { newMessageSent, currentMessageThreadName, currentMessageThreadUserName, curentUserFirstName } = this.props;
    if (this.state.messageInputFieldValue !== '') {
      const newMessage = {
        message: this.state.messageInputFieldValue,
        recipient: currentMessageThreadUserName,
        sender: curentUserFirstName,
        threadName:currentMessageThreadName
      };
      newMessageSent(newMessage);
      this.setState({
        messageInputFieldValue: ''
      });
    }
  }

  shouldDisplayTime(timeOne, timeTwo) {
    let displayTime = true;
    console.log('time difference', moment.duration(moment(timeOne) - moment(timeTwo)).asMinutes());
    if (moment(timeOne).fromNow() === moment(timeTwo).fromNow() || moment.duration(moment(timeOne) - moment(timeTwo)).asMinutes() < 30) {
      displayTime = false;
    }
    return displayTime;
  }

  render() {
    const { currentMessageThread, currentMessageThreadUserName, curentUserFirstName } = this.props;

    return (
      <div>
        <div  className="messaging-thread-header-container">
          <h1 className="messaging-thread-header">Discussion with {currentMessageThreadUserName}</h1>
        </div>
        <div className="messages-container">
          <div className="messages-container-inner">
            {currentMessageThread.map((message, i, messageList) => {
              let displayTime = i === 0 ? true : this.shouldDisplayTime(message.time, messageList[i-1].time);
              return (
                <Message
                  key={message['_id']}
                  message={message}
                  displayTime={displayTime}
                  curentUserFirstName={curentUserFirstName}
                />
              );
            })}
          </div>
        </div>
        <div className="messaging-thread-new-message-container">
          <InputField
            placeholderText="Enter your message here"
            changeHandler={this.newMessageInputFieldChange}
            value={this.state.messageInputFieldValue}
            styleClassName="messaging-thread-new-message-input-field"
            containerStyleClassName="messaging-thread-new-message-input-field-container"
          />
          <Button
            value="Send"
            styleClassName="button-primary"
            clickHandler={this.sendNewMessageClicked}
            containerStyleClassName="messaging-thread-new-message-button-container"
          />
        </div>
      </div>
    );
  }
};

