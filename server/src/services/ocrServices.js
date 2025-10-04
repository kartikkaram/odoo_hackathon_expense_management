// services/ocrService.js
import AWS from "aws-sdk";
import fs from "fs";

AWS.config.update({
  region: "ap-south-1", // Mumbai
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const textract = new AWS.Textract();

/**
 * Analyze receipt using Textract
 * @param {string} filePath - path to receipt image/PDF
 * @returns {Promise<Object>} extracted fields
 */
export const analyzeReceipt = async (filePath) => {
  const imageBytes = fs.readFileSync(filePath);

  const params = {
    Document: {
      Bytes: imageBytes,
    },
  };

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
