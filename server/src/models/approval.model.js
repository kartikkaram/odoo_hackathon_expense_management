// models/approval.model.js
import mongoose from "mongoose";
const { Schema, Types } = mongoose;
const ObjectId = Types.ObjectId;

/**
 * ApprovalFlow: reusable template (or instance) describing ordered steps (users)
 * Each step contains a list of approver user IDs (explicit users).
 */
const ApprovalFlowSchema = new Schema({
  company: { type: ObjectId, ref: "Company", required: true },
  name: { type: String, required: true },

  // steps: ordered array; each step can include one or more approver user IDs.
  steps: [
    {
      stepNumber: { type: Number, required: true }, // 1,2,3...
      approvers: [{ type: ObjectId, ref: "User", required: true }], // explicit users
    },
  ],

  // ruleType / ruleConfig kept for compatibility (Percentage/Specific/Hybrid)
  ruleType: { type: String, enum: ["Percentage", "Specific", "Hybrid"], required: true },
  ruleConfig: {
    percentage: { type: Number },
    specificRole: { type: String },
    logic: { type: String, enum: ["OR", "AND"], default: "OR" },
  },

  enforceSequence: { type: Boolean, default: true }, // whether to send sequentially
}, { timestamps: true });


const ApprovalSchema = new Schema({
  expense: { type: ObjectId, ref: "Expense", required: true },
  approvalFlow: { type: ObjectId, ref: "ApprovalFlow" }, // which flow used
  primaryManager: { type: ObjectId, ref: "User" },

  // The ordered list of mandatory approvers broken into steps (stepIndex indicates position)
  mandatoryApprovers: [
    {
      user: { type: ObjectId, ref: "User", required: true },
      stepIndex: { type: Number, required: true }, // 0 = first step, 1 = second, ...
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      comment: { type: String },
      decidedAt: { type: Date },
    },
  ],

  // Controls & state
  enforceSequence: { type: Boolean, default: true },
  currentStepIndex: { type: Number, default: 0 }, // which step is currently active
  overallStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
}, { timestamps: true });

export const ApprovalFlow = mongoose.model("ApprovalFlow", ApprovalFlowSchema);
export const Approval = mongoose.model("Approval", ApprovalSchema);
