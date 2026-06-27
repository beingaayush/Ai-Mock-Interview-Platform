// const express = require("express");

// const {
//   startInterview,
//   submitAnswer,
//   generateInterviewReport,
// } = require("../controllers/interviewController");
// const { startSession, getNextQuestion } = require("../controllers/sessionController");


// const router = express.Router();

// router.post("/start-interview", startInterview);
// router.post("/submit-answer", submitAnswer);
// router.post("/generate-report", generateInterviewReport);

// router.post("/start-session", startSession);
// router.post("/next-question", getNextQuestion);

// module.exports = router;


const express = require("express");
const { startSession, getNextQuestion } = require("../controllers/sessionController");

const router = express.Router();

// Sirf 2 simple routes
router.post("/start-session", startSession);
router.post("/next-question", getNextQuestion);

module.exports = router;