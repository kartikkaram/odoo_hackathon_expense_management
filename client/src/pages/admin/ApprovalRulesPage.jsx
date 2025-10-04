import { Plus } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';

// Mock Data
const rules = [
  {
    name: 'High-Value Expense Review',
    description: 'All expenses exceeding $500 must be reviewed by the Finance department.',
    conditions: ['Amount is greater than $500'],
  },
  {
    name: 'International Travel Approval',
    description: 'Requires Director-level approval for any expense categorized as International Travel.',
    conditions: ['Category is "International Travel"'],
  },
  {
    name: 'Software Subscription Policy',
    description: 'All software subscriptions require approval from the assigned department head.',
    conditions: ['Category is "Software"'],
  }
];

const ApprovalRulesPage = () => {
  return (
    <>
      <PageHeader
        title="Approval Rules"
        subtitle="Manage the workflows and conditions for expense approvals."
        action={
          <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Plus size={16} /> Add New Rule
          </button>
        }
      />

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{rule.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{rule.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Delete</button>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Conditions</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {rule.conditions.map((cond, i) => (
                   <span key={i} className="px-2.5 py-1 text-sm bg-slate-100 text-slate-700 rounded-md">
                    {cond}
                   </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ApprovalRulesPage;