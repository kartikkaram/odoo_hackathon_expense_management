const ReceiptSchema = new Schema({
  company: { type: ObjectId, ref: 'Company', required: true },
  employee: { type: ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  ocrExtracted: {
    amount: Number,
    date: Date,
    merchant: String,
    category: String,
  },
  createdAt: { type: Date, default: Date.now },
});
