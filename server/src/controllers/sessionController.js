const Session = require("../models/Session");
const { generateFirstQuestion, evaluateAnswer } = require("../services/geminiService");

// START SESSION
async function startSession(req, res) {
  try {
    const { role, experience } = req.body;

    const session = await Session.create({
      role,
      experience,
      questions: [],
      currentIndex: 0,
      isCompleted: false,
    });

    const question = await generateFirstQuestion(role);

    session.questions.push({ question });
    session.currentIndex = 1;

    await session.save();

    res.json({ sessionId: session._id, question });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// NEXT QUESTION FLOW
async function getNextQuestion(req, res) {
  try {
    const { sessionId, question, answer } = req.body;

    const session = await Session.findById(sessionId);

    const result = await evaluateAnswer(question, answer);

    session.questions.push({ question, answer });

    const nextQ = result.nextQuestion;

    session.questions.push({ question: nextQ });

    session.currentIndex += 1;

    await session.save();

    res.json({
      evaluation: result.evaluation,
      nextQuestion: nextQ,
      currentIndex: session.currentIndex,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { startSession, getNextQuestion };