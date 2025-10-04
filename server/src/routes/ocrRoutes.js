// routes/ocrRoutes.js
import express from "express";
import multer from "multer";
import { uploadReceipt } from "../controllers/ocrController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/receipt", upload.single("receipt"), uploadReceipt);

export default router;
