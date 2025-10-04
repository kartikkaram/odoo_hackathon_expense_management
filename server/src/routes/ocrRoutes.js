// routes/ocrRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs/promises"; // Using promises for cleaner async/await
import { analyzeReceipt } from "../services/ocrServices.js";

const router = express.Router();

// Configure multer for temporary file storage
const upload = multer({ dest: "uploads/" });

/**
 * Controller function to handle receipt analysis.
 * It can accept either a file upload (multipart/form-data) or a URL (application/json).
 */
const handleReceiptAnalysis = async (req, res) => {
  let sourcePath = null;
  
  try {
    // Determine the source of the receipt (file vs. URL)
    if (req.file) {
      // Source is an uploaded file
      sourcePath = req.file.path;
    } else if (req.body && req.body.url) {
      // Source is a URL from the request body
      sourcePath = req.body.url;
    } else {
      // No valid source was provided
      return res.status(400).json({
        error: "Bad Request: Please provide a receipt image file in a 'receipt' field or a 'url' in the JSON body.",
      });
    }

    // Call the service function with the determined source
    console.log(`Analyzing receipt from source: ${sourcePath}`);
    const analysisResult = await analyzeReceipt(sourcePath);

    if (!analysisResult) {
      throw new Error("Receipt analysis returned no result.");
    }

    // Send the successful result back to the client
    res.status(200).json(analysisResult);

  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in /receipt route:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  } finally {
    // Clean up: delete the temporary file if it was uploaded
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
        console.log(`Successfully deleted temp file: ${req.file.path}`);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary file:", cleanupError);
      }
    }
  }
};

// Define the POST route.
// 'upload.single("receipt")' handles the file upload.
// 'handleReceiptAnalysis' is the controller that processes the request.
router.post("/receipt", upload.single("receipt"), handleReceiptAnalysis);

export default router;