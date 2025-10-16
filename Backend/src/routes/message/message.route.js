import express from "express";
import { StatusCodes } from "http-status-codes";
import auth from "../../middleware/auth.js";
import Message from "../../models/Message.js";
import Conversation from "../../models/Conversation.js";

const messageRouter = express.Router();

// POST /api/v1/messages/send - send a message
messageRouter.post("/send", auth, async (req, res) => {
  const { conversationId, content, mediaURL, mediaType } = req.body;
  if (!conversationId || (!content && !mediaURL)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: true,
      message: "conversationId and content or mediaURL required",
    });
  }
  try {
    const newMessage = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      content: content || null,
      mediaURL: mediaURL || null,
      mediaType: mediaType || null,
    });

    // update conversation lastMessage and updatedAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      updatedAt: new Date(),
    });

    const populated = await Message.findById(newMessage._id).populate(
      "sender",
      "_id user_name avatar"
    );

    // Broadcast via socket to room + namespaced channel (like your example)
    try {
      req.io?.to?.(conversationId)?.emit?.("message:new", populated);
      req.io?.emit?.(`conversation:${conversationId}:message:update`, populated);
    } catch {}

    return res.status(StatusCodes.CREATED).json({
      success: true,
      error: false,
      message: "Message sent",
      data: populated,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: "Failed to send message",
    });
  }
});

// POST /api/v1/messages/:id/read - mark as read
messageRouter.post("/:id/read", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Message.findByIdAndUpdate(
      id,
      { $addToSet: { readBy: req.user.id } },
      { new: true }
    );
    if (!updated) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: true,
        message: "Message not found",
      });
    }

    // Emit read receipt to conversation room + namespaced channel
    try {
      const convId = String(updated.conversation);
      req.io?.to?.(convId)?.emit?.("message:read", {
        messageId: id,
        userId: req.user.id,
      });
      req.io?.emit?.(`conversation:${convId}:message:read`, {
        messageId: id,
        userId: req.user.id,
      });
    } catch {}

    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      message: "Message marked as read",
      data: updated,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: "Failed to update read status",
    });
  }
});

export default messageRouter;


