const mongoose = require("mongoose")

const userModel = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        min: 3,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 3,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('User', userModel)