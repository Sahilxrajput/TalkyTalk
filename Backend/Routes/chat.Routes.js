const router = require("express").Router();
const chatController = require("../Controllers/chat.Controller");
const { body } = require("express-validator");
const { userAuth } = require("../Middlewares/userAuth.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });

// router.post(
//   "/",
//   [
//     body("userId")
//       .exists({ checkFalsy: true })
//       .withMessage("userId is required"),
//   ],
//   userAuth,
//   chatController.accessChat
// );

router.get("/", userAuth, chatController.accessChats);

router.get("/chatIds", userAuth, chatController.getChatIds);

router.post(
  "/group",
  upload.single("image"),
  [
    body("chatName")
      .isLength({ min: 3 })
      .withMessage("group name should be minimum 3 letter long"),
    body("members")
      .isArray({ min: 2 })
      .withMessage("At least three people are needed to create a group chat"),
  ],
  userAuth,
  chatController.createGroupChat
);

router.post(
  "/personal",
  [
    body("chatName")
      .isLength({ min: 3 })
      .withMessage("group name should be minimum 3 letter long"),
    body("members")
      .isArray({ min: 1 }, { max: 1 })
      .withMessage("Only two people are needed to create a group chat"),
  ],
  userAuth,
  chatController.createPersonalChat
);

router.put(
  "/groupadd",
  [
    body("chatId")
      .exists({ checkFalsy: true })
      .withMessage("chatId is required"),
    body("userIds")
      .exists({ checkFalsy: true })
      .withMessage("userId is required"),
  ],
  userAuth,
  chatController.addToGroup
);

router.put(
  "/groupremove",
  [
    body("chatId")
      .exists({ checkFalsy: true })
      .withMessage("chatId is required"),
    body("userIds")
      .exists({ checkFalsy: true })
      .withMessage("userId is required"),
  ],
  userAuth,
  chatController.removeFromGroup
);

router.put(
  "/grouprename",
  [
    body("chatId")
      .exists({ checkFalsy: true })
      .withMessage("chatId is required"),
    body("updatedChatName")
      .isLength({ min: 3 })
      .withMessage("group name should be minimum 3 letter long"),
  ],
  userAuth,
  chatController.renameGroup
);

module.exports = router;
