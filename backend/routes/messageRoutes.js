
const { setMessage, getMessage } = require('../controllers/messageControlls');

const router = require('express').Router()

router.post('/setmessage', setMessage)

router.post('/getmessage', getMessage)


module.exports = router
