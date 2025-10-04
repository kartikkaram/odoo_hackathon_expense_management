import { sendToGemini } from "./send-to-llm.js";
import { apiError } from "./apiError.js";

export async function generateAiSuggestion(evaluatedAnswers, quiz) {
  let aiSuggestion = "";

  try {
    const incorrectQuestions = evaluatedAnswers
      .filter(a => !a.isCorrect)
      .map(a => {
        const q = quiz.questions.find(q => q.questionId === a.questionId);
        return q ? q.text : "";
      });

    if (incorrectQuestions.length > 0) {
      const prompt = `The user answered the following questions incorrectly: ${incorrectQuestions.join("; ")}. 
For each incorrectly answered question: 
- Give 2 short, practical tips on how the user could have approached the question to reach the correct answer. 
- Keep the tips concise, clear, and actionable. 
- Do NOT include any introductions, explanations, or extra text. 
- Output ONLY the bullet points.`;

      aiSuggestion = await sendToGemini(prompt);
    }
  } catch (err) {
    console.error("AI suggestion error:", err);
    aiSuggestion = "";
  }

  return aiSuggestion;
}
