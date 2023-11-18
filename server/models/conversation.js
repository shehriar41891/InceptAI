const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
});

const ConversationModel = mongoose.model('ConversationModel', ConversationSchema);

module.exports = ConversationModel;
