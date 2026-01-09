const Chat = require("../Models/chat.Model");
const Message = require("../Models/message.Model");
const { validationResult } = require("express-validator");





module.exports.postChat = async (req, res) => {
    const userMessage = req.body.message;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // or "gpt-4"
        messages: [{ role: "user", content: userMessage }],
    });

    res.json(chatCompletion.choices[0].message);

}

module.exports.createPersonalChat = async (req, res) => {
    const { memberId } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const currentUserId = String(req.user._id);

    if (currentUserId === memberId) {
        return res
            .status(400)
            .json({ message: "You cannot create a chat with yourself." });
    }
    try {
        const existingChat = await Chat.findOne({
            isGroupChat: false,
            members: { $all: [currentUserId, memberId], $size: 2 },
        });

        if (existingChat) {
            return res.status(200).json({
                message: "Personal chat already exists",
                chat: existingChat,
                duplicate: true,
            });
        }

        // Create new personal chat
        const personalChat = await Chat.create({
            members: [currentUserId, memberId],
            isGroupChat: false,
            groupAdmin: null,
            chatName: null,
        });

        // @remind
        const fullPersonalChat = await Chat.findById(personalChat._id)
            .populate("members", "-password")
            .populate("groupAdmin", "-password");

        return res.status(201).json(fullPersonalChat);
    } catch (error) {
        console.error("Error creating personal chat:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.createGroupChat = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { chatName, memberIds } = req.body;

    const groupMemberIds = [...memberIds, req.user._id];

    try {
        const groupChat = await Chat.create({
            chatName,
            members: groupMemberIds,
            isGroupChat: true,
            groupAdmin: req.user._id,
            image: {
                url: req.file?.path || null,
                filename: req.file?.fileName || null,
            },
        });


        // const fullGroupChat = await Chat.findById(groupChat._id)
        // .populate("members", "-password")
        // .populate("groupAdmin", "-password");

        // console.log("full grp cretared :", fullGroupChat)
        res.status(200).json(groupChat);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.accessChats = async (req, res) => {
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //   return res.status(422).json({ errors: errors.array() });
        // }

        let chats = await Chat.find({
            members: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("members", "-password")
            .sort({ updatedAt: -1 });

        console.log(chats)
        res.json(chats || []);
    } catch (error) {
        console.error(error)
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

module.exports.ViewChatDetails = async (req, res) => {
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

        const isAdmin = String(req.user._id) === String(chat.groupAdmin._id);
        const isRemovingSelf = idsToRemove.includes(String(req.user._id));

        if (!isAdmin && !isRemovingSelf) {
            return res
                .status(403)
                .json({ message: "You are not authorized to perform this action." });
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
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports.clearChat = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const chatId = req.params.chatId;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        if (chat.isGroupChat && String(chat.groupAdmin) !== String(req.user._id)) {
            return res
                .status(403)
                .json({ error: "Only group admin can delete the chat messages" });
        }

        const deleted = await Message.deleteMany({ chatId: chatId });

        return res
            .status(200)
            .json({
                success: true,
                message: `${deleted.deletedCount} message(s) deleted successfully`,
            });
    } catch (err) {
        console.error("Delete messages error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.deleteChat = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const chatId = req.params.chatId;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        if (String(chat.groupAdmin) !== String(req.user._id) && chat.isGroupChat) {
            return res
                .status(403)
                .json({ error: "Only group admin can delete the chat" });
        }

        await Chat.findByIdAndDelete(chatId);

        return res
            .status(200)
            .json({ success: true, message: "Chat deleted successfully" });
    } catch (err) {
        console.error("Delete chat error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
