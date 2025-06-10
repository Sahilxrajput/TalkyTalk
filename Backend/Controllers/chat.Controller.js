const User = require("../Models/user.Model");
const Chat = require("../Models/chat.Model");
const { validationResult } = require("express-validator");

module.exports.createPersonalChat = async (req, res) => {
  const { chatName, members } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!chatName || !members) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  if (members.length == 2) {
    return res.status(400).json({
      message: "Only one user are required to create a personal chat",
    });
  }

  members.push(req.user);

  try {
    const personalChat = await Chat.create({
      chatName: chatName,
      members: members,
      isGroupChat: false,
      groupAdmin: null,
    });

    console.log("personalChat", personalChat);

    const fullPersonalChat = await Chat.findOne({ _id: personalChat._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullPersonalChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.createGroupChat = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { chatName, members } = req.body;

  if (!chatName || !members) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  let url = req.file.path;
  let filename = req.file.filename;

  if (members.length < 1) {
    return res.status(400).json({
      message: "at least two members are required to create a group chat",
    });
  }

  const groupMembers = [...members, req.user];

  try {
    const groupChat = await Chat.create({
      chatName,
      members: groupMembers,
      isGroupChat: true,
      groupAdmin: req.user,
      image: { url, filename },
    });
    console.log("groupChat", groupChat);

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.accessChats = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let chat = await Chat.find({
      members: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("members", "-password")
      .sort({ updatedAt: -1 });

    if (chat.length > 0) {
      res.json(chat);
    } else {
      res.status(404).json({ message: "No chats found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.renameGroup = async (req, res) => {
  const { chatId, updatedChatName } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  //admin check*
  const chat = await Chat.findById(chatId);
  console.log(chat.groupAdmin._id);
  console.log(req.user._id);
  if (req.user._id.equals(chat.groupAdmin._id)) {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: updatedChatName,
      },
      {
        new: true,
      }
    )
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404).json({ message: "Chat not found" });
    } else {
      res.status(200).json(updatedChat);
    }
  } else {
    return res
      .status(403)
      .json({ message: "Only admins can rename the chat group" });
  }
};

module.exports.removeFromGroup = async (req, res) => {
  const { chatId, userIds } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const idsToRemove = Array.isArray(userIds) ? userIds : [userIds];

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (String(req.user._id) !== String(chat.groupAdmin._id)) {
      return res
        .status(403)
        .json({ message: "Only admins can remove other members" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { members: { $in: idsToRemove } } },
      { new: true }
    )
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (err) {
    console.error("Error removing user(s) from group:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.addToGroup = async (req, res) => {
  const { chatId, userIds } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const idsToAdd = Array.isArray(userIds) ? userIds : [userIds];

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ err: "Chat not found" });
    }

    // Check if requester is admin
    if (String(req.user._id) !== String(chat.groupAdmin._id)) {
      return res.status(403).json({ message: "Only admins can add members" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: { members: { $each: idsToAdd } },
      },
      { new: true }
    )
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (err) {
    console.error("Add to group error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.getChatIds = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let chats = await Chat.find({
      members: { $elemMatch: { $eq: req.user._id } },
    })
      //.populate("members", "-password")
      .sort({ updatedAt: -1 });

    if (chats.length > 0) {
      const chatId = chats.map((chat) => chat._id);
      res.json(chatId);
    } else {
      res.status(404).json({ message: "No chats found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
