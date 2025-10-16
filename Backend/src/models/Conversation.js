import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    // Strictly one-on-one: exactly two participants
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // For Quick Access (to show in a chat list)
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
export default Conversation;
