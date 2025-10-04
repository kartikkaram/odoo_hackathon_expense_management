// services/ocrService.js
import AWS from "aws-sdk";
import fs from "fs";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const textract = new AWS.Textract();

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/** Download image from URL */
const downloadImage = async (url) => {
    // Using fetch within a modern async/await structure
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
};


/** Extract receipt with Textract */
const extractWithTextract = async (imageBuffer) => {
  const params = { Document: { Bytes: imageBuffer } };

  return new Promise((resolve, reject) => {
    textract.analyzeExpense(params, (err, data) => {
      if (err) return reject(err);

      const extracted = {};
      if (data?.ExpenseDocuments?.length) {
        data.ExpenseDocuments[0].SummaryFields.forEach((field) => {
          const type = field.Type?.Text;
          const val = field.ValueDetection?.Text;
          if (type && val) extracted[type] = val;
        });
      }
      resolve({ raw: data, extracted });
    });
  });
};

/**
 * Refine receipt text with Gemini 1.5 Flash.
 * NOTE: The model is 'gemini-1.5-flash-latest'. There is no '2.5' preview model available.
 */
const refineWithGemini = async (text) => {
  if (!text) {
    console.log("No text from Textract to refine.");
    return null;
  }
  
  try {
    // Select the Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Create a detailed prompt for the model to ensure structured JSON output
    const prompt = `
      You are an intelligent receipt processing agent.
      Analyze the following raw text extracted from a receipt and parse it into a structured JSON object.

      The JSON object must include the following fields:
      - "merchantName": string
      - "transactionDate": string (formatted as YYYY-MM-DD)
      - "totalAmount": number
      - "items": an array of objects, where each object has "description" (string) and "price" (number).
      - "currency": string (e.g., "USD", "INR")

      look for the value in the text it may have different name like total, amount paid, total paid etc.
      find the date in the text it may have different name like date of purchase, transaction date etc.
      If any field is not found, set it to null.
      Ensure the JSON is well-formed.

      If a value is not found, set it to null. Do not invent data.

      Raw receipt text:
      ---
      ${text}
      ---
    `;

    // Configuration to ensure the model outputs JSON
    const generationConfig = {
      response_mime_type: "application/json",
    };

    const result = await model.generateContent(prompt, generationConfig);
    const response = result.response;
    let responseText = response.text();

    // The response text is a JSON string, so we parse it
        // ⚡ Strip code blocks if present
    responseText = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(responseText);

  } catch (err) {
    console.error("Gemini API error:", err);
    return null;
  }
};

/** Main function: analyze receipt (file path or URL) */
export const analyzeReceipt = async (source) => {
  let imageBuffer;
  // Check if the source is a URL or a local file path
  if (source.startsWith("http")) {
    imageBuffer = await downloadImage(source);
  } else {
    imageBuffer = fs.readFileSync(source);
  }

  // Step 1: Extract raw data with Textract
  const textractData = await extractWithTextract(imageBuffer);

  // Step 2: Consolidate text from Textract for Gemini
  const allText =
    textractData.raw?.ExpenseDocuments?.[0]?.LineItemGroups
      ?.flatMap((group) =>
        group.LineItems.map((item) =>
          item.LineItemExpenseFields.map((f) => f.ValueDetection?.Text).join(" ")
        )
      )
      .join("\n") || Object.values(textractData.extracted).join("\n");

  // Step 3: Refine with Gemini
  const geminiData = await refineWithGemini(allText);

  return {
    textract: textractData.extracted, // Raw key-value pairs from Textract
    gemini: geminiData,             // Structured JSON from Gemini
  };
};