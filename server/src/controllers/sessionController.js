const Session = require("../models/Session");
const Interview = require("../models/Interview"); // Final report save karne ke liye
const { generateFirstQuestion, evaluateAnswer, generateReport } = require("../services/geminiService");

const MAX_QUESTIONS = 8; // Yahan limit set ki hai

// 1. START SESSION
async function startSession(req, res) {
  try {
    const { role, experience } = req.body;
    const { userId, role, experience } = req.body;

    const session = await Session.create({
      userId,
      role,
      experience,
      questions: [],
      currentIndex: 0,
      isCompleted: false,
    });

    const question = await generateFirstQuestion(role);

    // Pehla question save kar rahe hain (bina answer ke)
    session.questions.push({ question, answer: "" });
    session.currentIndex = 1;

    await session.save();

    res.json({ sessionId: session._id, question, currentIndex: session.currentIndex });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// 2. NEXT QUESTION OR FINAL REPORT
async function getNextQuestion(req, res) {
  try {
    const { sessionId, question, answer } = req.body;

    const session = await Session.findById(sessionId);

    if (session.isCompleted) {
      return res.status(400).json({ message: "Interview already completed!" });
    }

    // AI se answer evaluate karwa rahe hain
    const result = await evaluateAnswer(question, answer);

    // Database me user ka answer save kar rahe hain
    const lastIndex = session.questions.length - 1;
    session.questions[lastIndex].answer = answer;

    // CHECK: Kya hum 8 questions tak pahunch gaye?
    if (session.currentIndex < MAX_QUESTIONS) {
      // Agar 8 se kam hai -> Next Question generate karo
      const nextQ = result.nextQuestion;
      
      session.questions.push({ question: nextQ, answer: "" });
      session.currentIndex += 1;
      
      await session.save();

      return res.json({
        evaluation: result.evaluation,
        nextQuestion: nextQ,
        currentIndex: session.currentIndex,
        isCompleted: false
      });

    } else {
      // Agar 8 questions pure ho gaye -> Final Report generate karo
      session.isCompleted = true;
      await session.save();

      const report = await generateReport(session.questions);

      // Final report ko nayi 'Interview' table me save kar rahe hain
      const savedInterview = await Interview.create({
        userId: session.userId,
        role: session.role,
        questions: session.questions,
        score: report.score || 0,
        strengths: report.strengths || [],
        weaknesses: report.weaknesses || [],
        improvementAreas: report.improvementAreas || [],
        summary: report.summary || "",
      });

      return res.json({
        evaluation: result.evaluation,
        isCompleted: true, // Frontend ko pata chal jayega ki interview khatam
        report: report,
        finalReportId: savedInterview._id
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { startSession, getNextQuestion };