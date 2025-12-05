import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  userId:      { type: String, required: true },
  skillName:   { type: String, required: true },
  progress:    { type: Number, default: 0 },
  streak:      { type: Number, default: 0 },
  lastPractice:{ type: Date }
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model("Skill", skillSchema);
