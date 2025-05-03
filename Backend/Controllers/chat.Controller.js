const User = require("../Models/user.Model");
const Chat = require("../Models/chat.Model");
const { validationResult } = require("express-validator");

module.exports.personalChat = async (req, res) => {
  const { chatName, members } = req.body;

  if (!chatName || !members) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (members.length != 1) {
    return res.status(400).json({
      message: "Only one user are required to create a personal chat",
    });
  }

  members.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: chatName,
      members: members,
      isGroupChat: true,
      groupAdmin: null,
    });
    console.log("groupChat", groupChat);

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
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

module.exports.createGroupChat = async (req, res) => {
  const { chatName, members } = req.body;

  if (!chatName || !members) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (members.length < 2) {
    return res.status(400).json({
      message: "More than two members are required to create a group chat",
    });
  }

  members.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: chatName,
      members: members,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    console.log("groupChat", groupChat);

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const chat = await Chat.findById(chatId);

  if (req.user._id == userId || req.user._id == chat.groupAdmin._id) {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { members: userId },
      },
      {
        new: true,
      }
    )
      .populate("members", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      res.status(404).json({ err: "Chat not found" });
    } else {
      res.status(200).json(removed);
    }
  } else {
    return res.status(403).json({ message: "Only admins can remove members" });
  }
};

module.exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { members: userId },
    },
    {
      new: true,
    }
  )
    .populate("members", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404).json({ err: "Chat not found" });
  } else {
    res.status(200).json(added);
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
  if (req.user._id == chat.groupAdmin._id) {
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
