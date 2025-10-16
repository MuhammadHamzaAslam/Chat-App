import express from "express";
import { StatusCodes } from "http-status-codes";
import auth from "../../middleware/auth.js";
import Conversation from "../../models/Conversation.js";
import Message from "../../models/Message.js";

const conversationRouter = express.Router();

// GET /api/v1/conversations - list user's conversations
conversationRouter.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "_id user_name email avatar")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "_id user_name avatar" } });

    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      message: "Conversations fetched successfully",
      data: conversations,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: "Failed to fetch conversations",
    });
  }
});

// POST /api/v1/conversations/create - create or fetch one-on-one
conversationRouter.post("/create", auth, async (req, res) => {
  const { userId } = req.body; // other participant
  if (!userId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: true,
      message: "userId is required",
    });
  }

  try {
    const selfId = req.user.id;
    // find existing one-on-one (not group) with same two participants
    const existing = await Conversation.findOne({
      participants: { $all: [selfId, userId], $size: 2 },
    })
      .populate("participants", "_id user_name email avatar")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "_id user_name avatar" } });

    if (existing) {
      return res.status(StatusCodes.OK).json({
        success: true,
        error: false,
        message: "Existing conversation fetched",
        data: existing,
      });
    }

    const conversation = await Conversation.create({
      participants: [selfId, userId],
    });
    const populated = await Conversation.findById(conversation._id)
      .populate("participants", "_id user_name email avatar")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "_id user_name avatar" } });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      error: false,
      message: "Conversation created",
      data: populated,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: "Failed to create conversation",
    });
  }
});

// GET /api/v1/conversations/:id/messages - paginated messages
conversationRouter.get("/:id/messages", auth, async (req, res) => {
  const { id } = req.params;
  const { limit = 50, before } = req.query;
  try {
    const query = { conversation: id };
    if (before) {
      query._id = { $lt: before };
    }
    const messages = await Message.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit))
      .populate("sender", "_id user_name avatar");

    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      message: "Messages fetched",
      data: messages.reverse(),
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: "Failed to fetch messages",
    });
  }
});

export default conversationRouter;


