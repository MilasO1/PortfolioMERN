import { Schema, model } from "mongoose";

const settingsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
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

export default model("Settings", settingsSchema);