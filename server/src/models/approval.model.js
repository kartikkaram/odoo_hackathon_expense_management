const ApprovalFlowSchema = new Schema({
  company: { type: ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },

  steps: [
    {
      stepNumber: Number,
      approverRole: { type: String, enum: ['Manager', 'Finance', 'Director'] },
    }
  ],

  ruleType: {
    type: String,
    enum: ['Percentage', 'Specific', 'Hybrid'],
  },
  ruleValue: Schema.Types.Mixed,
},{timestamps:true});
