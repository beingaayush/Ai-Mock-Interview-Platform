const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Yeh ensure karega ki bina user ke session na bane
    },
    role: String,
    experience: String,

    questions: [
      {
        question: String,
        answer: String,
      },
    ],

    currentIndex: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);