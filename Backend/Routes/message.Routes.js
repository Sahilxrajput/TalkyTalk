const router = require('express').Router()
const { sendMessage, deleteMessage, replyMessage, markSeenMessage, getAllMessages } = require('../Controllers/message.controller')
const { userAuth } = require("../Middlewares/userAuth.js");



router.post("/", userAuth, getAllMessages);

router.post('/send', userAuth,  sendMessage)

router.post('/mark-seen', userAuth,  markSeenMessage)

router.post("/delete", userAuth, deleteMessage )

// router.put('/replyTo', userAuth, replyMessage)

module.exports = router;
