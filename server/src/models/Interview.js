const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
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