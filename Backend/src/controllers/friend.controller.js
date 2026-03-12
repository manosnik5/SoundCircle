import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";

export const sendFriendRequest = async (req, res, next) => {
    try{
        const { receiverId } = req.body;
        const senderId = req.auth.userId;

        if (senderId === receiverId) {
            return res.status(400).json({ message: "Cannot send friend request to yourself" });
        }

        const sender = await User.findOne({ clerkId: senderId });

        if (sender.friends.includes(receiverId)) {
            return res.status(400).json({ message: "Already friends" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists" });
        }

        const friendRequest = await FriendRequest.create({
            sender: senderId,
            receiver: receiverId,
        });

        res.status(201).json(friendRequest);
    }catch (error) {
        next(error);
    }
}

export const acceptFriendRequest = async (req, res, next) => {
    try{
        const { requestId } = req.params;
        const userId = req.auth.userId;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.receiver !== userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (friendRequest.status !== "pending") {
            return res.status(400).json({ message: "Request already processed" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findOneAndUpdate(
            { clerkId: friendRequest.sender },
            { $addToSet: { friends: friendRequest.receiver } }
        );

        await User.findOneAndUpdate(
            { clerkId: friendRequest.receiver },
            { $addToSet: { friends: friendRequest.sender } }
        );

        res.status(200).json({ message: "Friend request accepted" });
    }catch (error) {
        next(error);
    }
}

export const rejectFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const userId = req.auth.userId;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.receiver !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    next(error);
  }
};

export const getPendingRequests = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    }).sort({ createdAt: -1 });

    const senderIds = requests.map((r) => r.sender);
    const senders = await User.find({ clerkId: { $in: senderIds } });

    const requestsWithSenders = requests.map((request) => ({
      ...request.toObject(),
      senderInfo: senders.find((s) => s.clerkId === request.sender),
    }));

    res.status(200).json(requestsWithSenders);
  } catch (error) {
    next(error);
  }
};

export const removeFriend = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const userId = req.auth.userId;

    await User.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { friends: friendId } }
    );

    await User.findOneAndUpdate(
      { clerkId: friendId },
      { $pull: { friends: userId } }
    );

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    next(error);
  }
};