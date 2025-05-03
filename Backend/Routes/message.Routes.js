const router = require('express').Router()
const { sendMessage, getAllMessages } = require('../Controllers/message.controller')
const { userAuth } = require("../Middlewares/userAuth.js");

router.post('/send', userAuth,  sendMessage)








module.exports = router;
