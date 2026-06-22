const express = require("express");

const {
  startInterview,
  submitAnswer,
  generateInterviewReport,
} = require("../controllers/interviewController");

const router = express.Router();

router.post("/start-interview", startInterview);
router.post("/submit-answer", submitAnswer);
router.post("/generate-report", generateInterviewReport);

module.exports = router;