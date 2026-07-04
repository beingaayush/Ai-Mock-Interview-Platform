const Session = require("../models/Session");
const Interview = require("../models/Interview"); // For saving the final Report/Feedback
const { generateFirstQuestion, evaluateAnswer, generateReport } = require("../services/geminiService");

const MAX_QUESTIONS = 8; // Question Limit

// 1. START SESSION
async function startSession(req, res) {
  try {
    const { userId, role, experience } = req.body;
    console.log("Received data:", { userId, role, experience });

    const session = await Session.create({
      userId,
      role,
      experience,
      questions: [],
      currentIndex: 0,
      isCompleted: false,
    });

    const question = await generateFirstQuestion(role);

    // Saving the first qn (without answer)
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

    // Evaluating the answer through Ai
    const result = await evaluateAnswer(question, answer);

    // saving the answer of the user in the database
    const lastIndex = session.questions.length - 1;
    session.questions[lastIndex].answer = answer;

    // CHECK: have we reached to our max qn limit (currently it's 8)?
    if (session.currentIndex < MAX_QUESTIONS) {
      // if Qn asked till now by Ai is less than 8 then -> generate next Qn 
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
      // If reached the limit (8 qns have been asked) -> Generate the final report
      session.isCompleted = true;
      await session.save();

      const report = await generateReport(session.questions);

      // Saving the final report in new 'interview' table
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
        isCompleted: true, // The frontend will know that the interview is over.
        report: report,
        finalReportId: savedInterview._id
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { startSession, getNextQuestion };