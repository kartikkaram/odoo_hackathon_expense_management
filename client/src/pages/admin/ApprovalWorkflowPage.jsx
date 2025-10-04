import { PageHeader } from '../../components/layout/PageHeader';
import { PlusCircle, Trash2 } from 'lucide-react';

// Mock Data for the approvers list
const approvers = [
  { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026704d', required: true },
  { id: 2, name: 'Mitchell Baker', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026705d', required: false },
  { id: 3, name: 'Andreas Healy', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026706d', required: false },
];

const ApprovalWorkflowPage = () => {
  return (
    <>
      <PageHeader
        title="Edit Approval Rule"
        subtitle="Configure approvers and conditions for this rule."
      />

      <div className="bg-white rounded-xl shadow-md">
        {/* --- Rule Details Section --- */}
        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="ruleName" className="block text-sm font-medium text-slate-600">Rule Name</label>
            <input 
              type="text" 
              id="ruleName"
              defaultValue="Approval rule for miscellaneous expenses" 
              className="mt-1 block w-full md:w-2/3 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
           <div>
            <label htmlFor="manager" className="block text-sm font-medium text-slate-600">Primary Manager</label>
            <select id="manager" className="mt-1 block w-full md:w-2/3 px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Sarah Johnson</option>
                <option>John Doe</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">This manager can be a fallback or final approver.</p>
          </div>
        </div>

        {/* --- Approvers & Conditions Section --- */}
        <div className="p-5 border-t border-slate-200">
          <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg">
            
            {/* Manager First Checkbox */}
            <div className="flex items-start pb-4 border-b border-slate-200">
              <input type="checkbox" id="managerFirst" className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <div className="ml-3 text-sm">
                <label htmlFor="managerFirst" className="font-medium text-slate-800">Is manager an approver?</label>
                <p className="text-slate-500">If checked, the request will go to the employee's direct manager before the approvers below.</p>
              </div>
            </div>

            {/* Approvers Table */}
            <div className="mt-4">
              <h3 className="text-base font-semibold text-slate-800 mb-2">Approvers</h3>
              <div className="space-y-2">
                {approvers.map((approver, index) => (
                  <div key={approver.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50">
                    <span className="text-sm font-bold text-slate-500">{index + 1}</span>
                    <img src={approver.avatar} alt={approver.name} className="w-8 h-8 rounded-full" />
                    <span className="flex-1 font-medium text-slate-700">{approver.name}</span>
                    <label htmlFor={`required-${approver.id}`} className="text-sm text-slate-600">Required?</label>
                    <input type="checkbox" defaultChecked={approver.required} id={`required-${approver.id}`} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <button className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
              <button className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                  <PlusCircle size={16}/> Add Approver
              </button>
            </div>
            
            {/* Flow Logic */}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
               <div className="flex items-start">
                <input type="checkbox" id="approverSequence" className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div className="ml-3 text-sm">
                  <label htmlFor="approverSequence" className="font-medium text-slate-800">Enforce approver sequence</label>
                  <p className="text-slate-500">If checked, the request goes to approvers in the defined order. Otherwise, all receive it at once.</p>
                </div>
              </div>

               <div className="flex items-center gap-3">
                  <label htmlFor="minPercentage" className="text-sm font-medium text-slate-800">Minimum Approval Percentage:</label>
                  <input type="number" id="minPercentage" placeholder="60" className="w-20 px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  <span className="text-lg font-medium text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="p-5 border-t border-slate-200 flex justify-end">
           <button className="bg-blue-600 text-white px-5 py-2.5 font-semibold rounded-lg hover:bg-blue-700">
              Save Rule
            </button>
        </div>
      </div>
    </>
  );
};

export default ApprovalWorkflowPage;