import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  name: {
    type: String,
    required: function () {
      return this.isGroupChat;
    }, // Required only for groups
    trim: true,
  },

  // Participants & Administration
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  admin: {
    // Only applicable for group chats
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // For Quick Access (to show in a chat list)
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
export default Conversation;
