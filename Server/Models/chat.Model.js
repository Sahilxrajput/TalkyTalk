const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        latestmessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        image: {
            url: String,
            filename: String,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: function () {
                return this.isGroupChat;
            },
            default:null,
        },
        chatName: {
            type: String,
            trim: true,
            required: function () {
                return this.isGroupChat;
            },
            default:null,
        },
        // readBy: [
        //   {
        //     user: {
        //       type: mongoose.Schema.Types.ObjectId,
        //       ref: "User",
        //     },
        //     count: {
        //       type: Number,
        //       default: 0,
        //     },
        //     readAt: {
        //       type: Date,
        //       default: Date.now,
        //     },
        //   },
        // ],
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
