import mongoose from "mongoose";
const { Schema, Types } = mongoose;
const ObjectId = Types.ObjectId;

// ----- Approval (instance per expense) -----
const ApprovalSchema = new Schema(
  {
    expense: { type: ObjectId, ref: "Expense", required: true },
    company: { type: ObjectId, ref: "Company", required: true },
    mandatoryApprovers: [
      {
        user: { type: ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
        comments: { type: String },
        approvedAt: { type: Date },
      },
    ],
    optionalApprovers: [
      {
        user: { type: ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
        comments: { type: String },
        approvedAt: { type: Date },
      },
    ],
    overallStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

const Approval = mongoose.model("Approval", ApprovalSchema);

// ----- ApprovalFlow (template) -----
const ApprovalFlowSchema = new Schema(
  {
    company: { type: ObjectId, ref: "Company", required: true },
    steps: [
      {
        stepNumber: { type: Number, required: true },
        approverRole: { type: String, enum: ["Manager", "Finance", "Director"], required: true },
        compulsory: { type: Boolean, default: false },
      },
    ],
    ruleType: { type: String, enum: ["Percentage", "Specific", "Hybrid"], required: true },
    ruleValue: { type: Schema.Types.Mixed, required: true },
    managerFirst: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ApprovalFlow = mongoose.model("ApprovalFlow", ApprovalFlowSchema);

// Export both as named exports
export { Approval, ApprovalFlow };
