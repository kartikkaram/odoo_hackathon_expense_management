import nodemailer from "nodemailer";
import { apiError } from "./apiError.js";



export const sendQuizSubmissionEmail = async (email, data) => {
  try {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD
      }
    });

    const html = `
      <p>Hi ${data.username || "User"},</p>
      <p>You have successfully submitted the quiz: <strong>${data.subject}</strong>.</p>
      <ul>
        <li>Score: ${data.score} / ${data.total}</li>
        <li>Percentage: ${data.percentage.toFixed(2)}%</li>
      </ul>
      <p><strong>AI Suggestions / Tips:</strong></p>
      <p>${data.aiSuggestion || "No suggestions available."}</p>
      <p>Keep learning and improving!</p>
    `;

    const mail = await transport.sendMail({
      from: `"Quiz Platform" <no-reply@quizplatform.com>`,
      to: email,
      subject: `Your Quiz Submission: ${data.subject}`,
      html
    });

    return mail;
  } catch (error) {
    throw new apiError(500, `Error sending quiz email: ${error.message}`);
  }
};
