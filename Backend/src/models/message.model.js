import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/encryption.js";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, { timestamps: true })



export const Message = mongoose.model("Message", messageSchema);