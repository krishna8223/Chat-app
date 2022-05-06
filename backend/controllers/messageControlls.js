const Message = require('../models/messageModel')

const setMessage = (req, res, next) => {
    try {

        const { from, to, message } = req.body

        const newMessage = new Message({ message, users: [from, to], sender: from }).save()
        res.json({ status: true, message: 'message save' })

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: 'Something went wrong' })

    }
}


const getMessage = async (req, res, next) => {

    try {


        const { from, to } = req.body

        const getMessage = await Message.find({ users: { $all: [from, to] } }).sort({ updatedAt: 1 })

        const sortMessages = getMessage.map((message) => {
            return {
                fromSelf: message.sender.toString() === from,
                message: message.message
            }
        })

        res.json(sortMessages)

    } catch (error) {
        console.log(error);
        res.json({ message: 'something went wrong' })

    }
}

module.exports = { setMessage, getMessage }