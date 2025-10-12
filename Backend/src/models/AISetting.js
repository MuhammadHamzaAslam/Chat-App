import mongoose from "mongoose";

const AISettingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  // AI Configuration
  aiAssistantEnabled: { type: Boolean, default: true },
  defaultPrompt: {
    type: String,
    default: "You are a friendly and concise chat assistant.",
  },

  // Usage Tracking
  apiUsageCount: { type: Number, default: 0 },
  lastUsageDate: { type: Date, default: Date.now },
});

const AISetting =
  mongoose.models.AISetting || mongoose.model("AISetting", AISettingSchema);
export default AISetting;
