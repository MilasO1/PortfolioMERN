const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    cookies: {
        type: Object,
        required: true,
        default: {}
    },
    preferences: {
        type: Object,
        required: true,
        default: {}
    }
});

module.exports = mongoose.model("Settings", settingsSchema);