import mongoose from 'mongoose';
const { Types } = mongoose;
const ObjectId = Types.ObjectId;

const ExpenseSchema = new mongoose.Schema({
  company: { type: ObjectId, ref: 'Company', required: true },
  employee: { type: ObjectId, ref: 'User', required: true },

  amountOriginal: { type: Number, required: true },
  currencyOriginal: { type: String, required: true }, // e.g. "USD"
  convertedAmount: { type: Number }, // converted into company's currency
  exchangeRate: { type: Number}, // rate used for conversion
  description: { type: String },
  category: { type: String, required: true },
  date: { type: Date, required: true },

  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },

  approvalFlow: { type: ObjectId, ref: 'ApprovalFlow' }, // which flow applied
  currentStep: { type: Number, default: 1 }, // track approval step
  approvals: [
    {
      approver: { type: ObjectId, ref: 'User' },
      step: Number,
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'] },
      comment: String,
      decidedAt: Date,
    }
  ],

  receipt: { type: ObjectId, ref: 'Receipt' },
},{timestamps:true});
const Expense =  mongoose.model('Expense', ExpenseSchema)
export { Expense };
