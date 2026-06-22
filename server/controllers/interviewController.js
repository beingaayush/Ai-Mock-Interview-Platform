const {
  generateFirstQuestion,
  evaluateAnswer,
  generateReport,
} = require("../services/geminiService");

async function startInterview(req, res) {
  try {
    const { role } = req.body;

    const question = await generateFirstQuestion(role);

    res.status(200).json({
      question,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
}

async function submitAnswer(req, res) {
  try {
    const { question, answer } = req.body;

    const result = await evaluateAnswer(question, answer);

    res.status(200).json(result);
  } catch (error) {
    console.error("ERROR => ", error);

    res.status(500).json({
      message: error.message,
    });
  }
}

async function generateInterviewReport(req, res) {
  try {
    const { interviewHistory } = req.body;

    const report = await generateReport(interviewHistory);

    res.status(200).json(report);
  } catch (error) {
    console.error("ERROR => ", error);

    res.status(500).json({
      message: error.message,
    });
  }
}


module.exports = {
  startInterview, submitAnswer, generateInterviewReport,
};