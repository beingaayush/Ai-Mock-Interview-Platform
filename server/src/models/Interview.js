const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: String,

    questions: [
      {
        question: String,
        answer: String,
      },
    ],

    score: Number,

    strengths: [String],

    weaknesses: [String],

    improvementAreas: [String],

    summary: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);