// const Session = require("../models/Session");
// const { generateFirstQuestion, evaluateAnswer } = require("../services/geminiService");

// // START SESSION
// async function startSession(req, res) {
//   try {
//     const { role, experience } = req.body;

//     const session = await Session.create({
//       role,
//       experience,
//       questions: [],
//       currentIndex: 0,
//       isCompleted: false,
//     });

//     const question = await generateFirstQuestion(role);

//     session.questions.push({ question });
//     session.currentIndex = 1;

//     await session.save();

//     res.json({ sessionId: session._id, question });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

// // NEXT QUESTION FLOW
// async function getNextQuestion(req, res) {
//   try {
//     const { sessionId, question, answer } = req.body;

//     const session = await Session.findById(sessionId);

//     const result = await evaluateAnswer(question, answer);

//     session.questions.push({ question, answer });

//     const nextQ = result.nextQuestion;

//     session.questions.push({ question: nextQ });

//     session.currentIndex += 1;

//     await session.save();

//     res.json({
//       evaluation: result.evaluation,
//       nextQuestion: nextQ,
//       currentIndex: session.currentIndex,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

// module.exports = { startSession, getNextQuestion };








const Session = require("../models/Session");
const Interview = require("../models/Interview"); // Final report save karne ke liye
const { generateFirstQuestion, evaluateAnswer, generateReport } = require("../services/geminiService");

const MAX_QUESTIONS = 5; // Yahan limit set ki hai

// 1. START SESSION
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

    // CHECK: Kya hum 5 questions tak pahunch gaye?
    if (session.currentIndex < MAX_QUESTIONS) {
      // Agar 5 se kam hai -> Next Question generate karo
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
      // Agar 5 questions pure ho gaye -> Final Report generate karo
      session.isCompleted = true;
      await session.save();

      const report = await generateReport(session.questions);

      // Final report ko nayi 'Interview' table me save kar rahe hain
      const savedInterview = await Interview.create({
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