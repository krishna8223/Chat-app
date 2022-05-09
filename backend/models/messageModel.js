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
    time:{
        type:Date,
        default: new Date
    }
   
},
    {
        timestamps: true
    }
)
module.exports = mongoose.model('Message', messageModel)