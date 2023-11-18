const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    conversationId:{
        Type: String 
    },
    senderId : {
        Type : String 
    },
    Message:{
        Type: String
    }
})

const MessageModel = mongoose.model('MessageModel',MessageSchema);

module.exports = MessageModel