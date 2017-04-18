const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var messageSchema = new mongoose.Schema({
    from: {type:String, required: true},
    to: {type:String, required: true},
    time: { type: Date, default: Date.now },
    msg: {type:String, required: true},
});

const messageThreadSchema = mongoose.Schema({
  thread: {type:String, required: true},
  messages: [messageSchema]
});

const Message = mongoose.model('Message', messageSchema);
const MessageThread = mongoose.model('MessageThread', messageThreadSchema);

module.exports = {
  Message,
  MessageThread,
};