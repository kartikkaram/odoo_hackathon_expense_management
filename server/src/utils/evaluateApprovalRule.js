export async function evaluateApprovalRules(expense) {
  const flow = await ApprovalFlow.findById(expense.approvalFlow);
  const { ruleType, ruleConfig } = flow;

  const approvalsInCurrentStep = expense.approvals.filter(a => a.step === expense.currentStep);

  // 1️⃣ Percentage rule
  if (ruleType === 'Percentage') {
    const total = approvalsInCurrentStep.length;
    const approved = approvalsInCurrentStep.filter(a => a.status === 'Approved').length;
    const percent = (approved / total) * 100;

    if (percent >= ruleConfig.percentage) {
      return { approved: true, reason: `${percent}% threshold met` };
    }
  }

  // 2️⃣ Specific approver rule
  if (ruleType === 'Specific') {
    const specificApprover = await User.findOne({
      company: expense.company,
      role: ruleConfig.specificRole
    });

    const hasApproved = approvalsInCurrentStep.some(a =>
      a.approver.toString() === specificApprover._id.toString() && a.status === 'Approved'
    );

    if (hasApproved) {
      return { approved: true, reason: `${ruleConfig.specificRole} approved` };
    }
  }

  // 3️⃣ Hybrid rule
  if (ruleType === 'Hybrid') {
    const total = approvalsInCurrentStep.length;
    const approved = approvalsInCurrentStep.filter(a => a.status === 'Approved').length;
    const percent = (approved / total) * 100;

    const specificApprover = await User.findOne({
      company: expense.company,
      role: ruleConfig.specificRole
    });
    const hasApproved = approvalsInCurrentStep.some(a =>
      a.approver.toString() === specificApprover._id.toString() && a.status === 'Approved'
    );

    if (ruleConfig.logic === 'OR') {
      if (percent >= ruleConfig.percentage || hasApproved)
        return { approved: true, reason: 'Hybrid OR condition met' };
    } else if (ruleConfig.logic === 'AND') {
      if (percent >= ruleConfig.percentage && hasApproved)
        return { approved: true, reason: 'Hybrid AND condition met' };
    }
  }

  return { approved: false };
}
