const User = require("../Models/user.Model");
const Message = require("../Models/message.Model");
const Chat = require("../Models/chat.Model");
const { validationResult } = require("express-validator");

module.exports.sendMessage = async (req, res) => {
  try {
    const { content, chatId, replyTo } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (!content || !chatId) {
      return res.status(400).json({ message: "Invalid data passed" });
    }

    let newMessage = {
      sender: req.user._id,
      content: content,
      chatId: chatId,
      replyTo: replyTo ? replyTo : null,
    };

    let message = await Message.create(newMessage);

    message = await message.populate(
      "sender",
      "firstName lastName username "
    );

    message = await message.populate("chatId");
    message = await User.populate(message, {
      path: "chat.members",
      select: "firstName lastName ",
    });

    message = await User.populate(message, {
      path: "replyTo.sender",
      select: "firstName lastName ",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    res.json(message);
    //res.json({ message: req.user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.body;
    if (!chatId) {
      return res.status(400).json({ message: "Invalid data passed" });
    }

    const messages = await Message.find({ chatId: chatId })
      .populate("sender")
      .populate("chatId")
      .populate("replyTo");
    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve messages",
      error: error.message,
    });
  }
};

module.exports.markSeenMessage = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const seenMessages = await Message.updateMany(
      {
        sender: senderId,
        "seenBy.user": { $ne: receiverId }, // Only update if not already seen
      },
      {
        $addToSet: { seenBy: { user: receiverId, seenAt: new Date() } },
      }
    );
    res
      .status(200)
      .json({ message: "Messages marked as seen", result: seenMessages });
  } catch (error) {
    console.error("Mark seen error:", error);
    res.status(500).json({ message: "Error marking messages as seen", error });
  }
};

module.exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;

    if (!messageId) {
      return res.status(400).json({ message: "Invalid data passed" });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};
