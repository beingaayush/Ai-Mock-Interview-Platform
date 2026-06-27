const express = require("express");
const { startSession, getNextQuestion } = require("../controllers/sessionController");

const router = express.Router();

router.post("/start-session", startSession);
router.post("/next-question", getNextQuestion);

module.exports = router;