// const {
//   generateFirstQuestion,
//   evaluateAnswer,
//   generateReport,
// } = require("../services/geminiService");

// async function startInterview(req, res) {
//   try {
//     const { role } = req.body;

//     const question = await generateFirstQuestion(role);

//     res.status(200).json({
//       question,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: error.message,
//     });
//   }
// }

// async function submitAnswer(req, res) {
//   try {
//     const { question, answer } = req.body;

//     const result = await evaluateAnswer(question, answer);

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("ERROR => ", error);

//     res.status(500).json({
//       message: error.message,
//     });
//   }
// }


// const Interview = require("../models/Interview");
// async function generateInterviewReport(req, res) {
//   try {
//     const { interviewHistory, role } = req.body;

//     const report = await generateReport(interviewHistory);

//     // SAVE TO DB
//     const savedInterview = await Interview.create({
//       role,
//       questions: interviewHistory.map((item) => ({
//         question: item.question,
//         answer: item.answer,
//       })),
//       score: report.score || 0,
//       feedback: report.feedback || "No feedback generated",
//     });

//     res.status(200).json({
//       report,
//       savedInterview,
//     });
//   } catch (error) {
//     console.error("ERROR => ", error);

//     res.status(500).json({
//       message: error.message,
//     });
//   }
// }


// module.exports = {
//   startInterview, submitAnswer, generateInterviewReport,
// };










const {
  generateFirstQuestion,
  evaluateAnswer,
  generateReport,
} = require("../services/geminiService");

const Interview = require("../models/Interview");

// START INTERVIEW
async function startInterview(req, res) {
  try {
    const { role } = req.body;

    const question = await generateFirstQuestion(role);

    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// SUBMIT ANSWER
async function submitAnswer(req, res) {
  try {
    const { question, answer } = req.body;

    const result = await evaluateAnswer(question, answer);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// FINAL REPORT + SAVE DB
async function generateInterviewReport(req, res) {
  try {
    const { interviewHistory, role } = req.body;

    const report = await generateReport(interviewHistory);

    const savedInterview = await Interview.create({
      role,
      questions: interviewHistory,
      score: report.score || 0,
      strengths: report.strengths || [],
      weaknesses: report.weaknesses || [],
      improvementAreas: report.improvementAreas || [],
      summary: report.summary || "",
    });

    res.status(200).json({
      report,
      savedInterview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  startInterview,
  submitAnswer,
  generateInterviewReport,
};