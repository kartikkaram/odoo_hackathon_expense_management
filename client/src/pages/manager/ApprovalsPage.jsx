import { PageHeader } from '../../components/layout/PageHeader';

// Mock Data
const approvals = [
  { employee: 'Jane Smith', date: 'Oct 03, 2025', category: 'Travel', amount: '₹550.00', status: 'Pending' },
  { employee: 'Peter Jones', date: 'Oct 03, 2025', category: 'Software', amount: '₹1,500.00', status: 'Pending' },
  { employee: 'Amit Patel', date: 'Oct 02, 2025', category: 'Food', amount: '₹950.00', status: 'Pending' },
];

const ApprovalsPage = () => {
  return (
    <>
      <PageHeader
        title="Approvals Overview"
        subtitle="Review and take action on expense reports submitted by your team."
      />
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-sm text-slate-600">
            <tr>
              <th className="p-3 font-medium text-left">Employee Name</th>
              <th className="p-3 font-medium text-left">Submitted Date</th>
              <th className="p-3 font-medium text-left">Category</th>
              <th className="p-3 font-medium text-left">Amount</th>
              <th className="p-3 font-medium text-left w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((item, index) => (
              <tr key={index} className="border-t border-slate-100">
                <td className="p-3 font-medium text-slate-800">{item.employee}</td>
                <td className="p-3 text-slate-700">{item.date}</td>
                <td className="p-3 text-slate-700">{item.category}</td>
                <td className="p-3 text-slate-700">{item.amount}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button className="w-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold py-1.5 px-3 rounded-md">
                      Reject
                    </button>
                    <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-1.5 px-3 rounded-md">
                      Approve
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ApprovalsPage;