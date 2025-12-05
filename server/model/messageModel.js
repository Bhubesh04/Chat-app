const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: {
        text: { type: String, required: true },
    },
    users: { type: Array, required: true },
    sender: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("messages", messageSchema);
