import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js"
import { decrypt } from "../utils/encryption.js";

export const getAllFriends = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId;
        
        const currentUser = await User.findOne({ clerkId: currentUserId });
        
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const users = await User.find({ 
            clerkId: { 
                $ne: currentUserId, 
                $in: currentUser.friends 
            } 
        });

        res.status(200).json(users);
    }catch (error) {
        next(error);
    }
}

export const searchUsers = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId;
        const { query } = req.query;

        const searchQuery = {
            clerkId: { $ne: currentUserId },
        };

        if (query) {
            searchQuery.fullName = { $regex: query, $options: 'i' };
        }

        const users = await User.find(searchQuery).limit(20);
        
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};


export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    const decrypted = messages.map(msg => ({
      _id: msg._id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: decrypt(msg.content),
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));

    res.status(200).json(decrypted);
  } catch (error) {
    next(error);
  }
};

