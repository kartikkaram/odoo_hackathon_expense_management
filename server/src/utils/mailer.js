// sendAccountCreationEmail.js
import axios from "axios";
import { apiError } from "./apiError.js";

/**
 * Generate the HTML for account creation email
 */
function getAccountCreationHtml(to, password) {
  return `
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
}

/**
 * Get Zoho OAuth access token using refresh token
 */
async function getZohoAccessToken() {
  try {
    const region = process.env.ZOHO_REGION || "com";
    const tokenUrl = `https://accounts.zoho.${region}/oauth/v2/token`;

    const params = new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: "refresh_token",
    });

    const res = await axios.post(tokenUrl, params);
    return res.data.access_token;
  } catch (err) {
    throw new apiError(500, `Error getting Zoho access token: ${err.message}`);
  }
}

/**
 * Send account creation email via Zoho Mail API
 */
export const sendAccountCreationEmail = async (to, password) => {
  try {
    const accessToken = await getZohoAccessToken();
    const region = process.env.ZOHO_REGION || "com";
    const accountId = process.env.ZOHO_ACCOUNT_ID;
    const fromEmail =process.env.ZOHO_FROM_EMAIL;

    const url = `https://mail.zoho.${region}/api/accounts/${accountId}/messages`;

    const htmlContent = getAccountCreationHtml(to, password);

    const emailData = {
      fromAddress: fromEmail,
      toAddress: to,
      subject: "Your Account Has Been Created",
      content: htmlContent,
      mailFormat: "html",
      askReceipt: "no",
    };

    const res = await axios.post(url, emailData, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (err) {
    throw new apiError(500, `Error sending account creation email: ${err.message}`);
  }
};
