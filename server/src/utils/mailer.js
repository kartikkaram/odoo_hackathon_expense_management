import nodemailer from "nodemailer";
import { apiError } from "./apiError.js";



export const sendAccountCreationEmail = async (to, from, password) => {
  try {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD,
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Welcome to Our Platform!</h2>
        <p>Hello,</p>
        <p>An account has been created for you by your Admin. Here are your login details:</p>
        <table style="border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${to}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Password:</td>
            <td style="padding: 8px;">${password}</td>
          </tr>
        </table>
        <p style="color: #555;">Please login and change your password immediately.</p>
        <p>Best regards,<br/>The Team</p>
      </div>
    `;

    await transport.sendMail({
      from, // now dynamic
      to,
      subject: "Your Account Has Been Created",
      html,
    });
  } catch (error) {
    throw new apiError(500, `Error sending account creation email: ${error.message}`);
  }
};
