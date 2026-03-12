import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            required: true,
        },
        receiver: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);