// models/approval.model.js
import mongoose from "mongoose";
const { Schema, Types } = mongoose;
const ObjectId = Types.ObjectId;

const ApprovalFlowSchema = new Schema(
  {
    company: { type: ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },

    //ordered array; each step can include one or more approver user IDs.
    steps: [
      {
        stepNumber: { type: Number, required: true },
        approvers: [{ type: ObjectId, ref: "User", required: true }],
      },
    ],

    // ruleType / ruleConfig kept for compatibility (Percentage/Specific/Hybrid)
    ruleType: {
      type: String,
      enum: ["Percentage", "Specific", "Hybrid"],
      required: true,
    },
    ruleConfig: {
      percentage: { type: Number },
      specificRole: { type: String },
      logic: { type: String, enum: ["OR", "AND"], default: "OR" },
    },

    enforceSequence: { type: Boolean, default: true }, // whether to send sequentially
  },
  { timestamps: true }
);


const ApprovalEntrySchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  stepIndex: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  comment: { type: String, default: null },
  decidedAt: { type: Date, default: null },
});

const ApprovalSchema = new Schema(
  {
    expense: { type: Types.ObjectId, ref: "Expense", required: true },
    approvalFlow: { type: Types.ObjectId, ref: "ApprovalFlow", required: true },
    primaryManager: { type: Types.ObjectId, ref: "User", required: true },
    mandatoryApprovers: [ApprovalEntrySchema],
    enforceSequence: { type: Boolean, default: true },
    currentStepIndex: { type: Number, default: 0 },
    overallStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Approval = mongoose.model("Approval", ApprovalSchema);

export default Approval;


export const ApprovalFlow = mongoose.model("ApprovalFlow", ApprovalFlowSchema);
