// controllers/ocrController.js
import { analyzeReceipt } from "../services/ocrService.js";
import fs from "fs";

/**
 * Upload receipt and get OCR data
 */
export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Receipt file is required" });

    const result = await analyzeReceipt(req.file.path);

    // Optional: remove file after processing
    fs.unlinkSync(req.file.path);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process receipt" });
  }
};
