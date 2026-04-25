import { Server } from "socket.io";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { encrypt, decrypt } from "../utils/encryption.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const userSockets = new Map(); 
  const userActivities = new Map(); 

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user_connected", async (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      const user = await User.findOne({ clerkId: userId });
      const friends = user?.friends || [];

      friends.forEach((friendId) => {
        const friendSocketId = userSockets.get(friendId);
        if (friendSocketId) {
          io.to(friendSocketId).emit("user_connected", userId);
        }
      });

      const onlineFriends = friends.filter((friendId) =>
        userSockets.has(friendId)
      );
      socket.emit("users_online", onlineFriends);

      const friendActivities = Array.from(userActivities.entries()).filter(
        ([uid]) => friends.includes(uid)
      );
      socket.emit("activities", friendActivities);
    });

    socket.on("update_activity", async ({ userId, activity }) => {
      console.log("activity_updated", userId, activity);
      userActivities.set(userId, activity);

      const user = await User.findOne({ clerkId: userId });
      const friends = user?.friends || [];

      friends.forEach((friendId) => {
        const friendSocketId = userSockets.get(friendId);
        if (friendSocketId) {
          io.to(friendSocketId).emit("activity_updated", { userId, activity });
        }
      });
    });

    socket.on("send_message", async ({ senderId, receiverId, content }) => {
      try {
        const sender = await User.findOne({ clerkId: senderId });
        if (!sender?.friends.includes(receiverId)) {
          socket.emit("message_error", "Cannot send message to non-friend");
          return;
        }

        // Encrypt manually before saving
        const message = await Message.create({
          senderId,
          receiverId,
          content: encrypt(content), // encrypt here
        });

        const messagePayload = {
          _id: message._id.toString(),
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: content, // send original plaintext to clients
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        };

        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", messagePayload);
        }

        socket.emit("message_sent", messagePayload);
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", async () => {
      let disconnectedUserId;

      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        const user = await User.findOne({ clerkId: disconnectedUserId });
        const friends = user?.friends || [];

        friends.forEach((friendId) => {
          const friendSocketId = userSockets.get(friendId);
          if (friendSocketId) {
            io.to(friendSocketId).emit("user_disconnected", disconnectedUserId);
          }
        });
      }
    });
  });

  return io;
};

export const emitFriendRequestNotification = (io, userSockets, receiverId) => {
  const receiverSocketId = userSockets.get(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("friend_request_received");
  }
};

export const emitFriendRequestAccepted = (io, userSockets, senderId) => {
  const senderSocketId = userSockets.get(senderId);
  if (senderSocketId) {
    io.to(senderSocketId).emit("friend_request_accepted");
  }
};