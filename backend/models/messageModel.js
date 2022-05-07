const mongoose = require("mongoose")

const messageModel = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   
},
    {
        timestamps: true
    }
)
module.exports = mongoose.model('Message', messageModel)