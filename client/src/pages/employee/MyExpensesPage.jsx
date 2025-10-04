import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SlideOver } from '../../components/ui/SlideOver';

// Mock Data
const expenses = [
  { date: 'Oct 03, 2025', category: 'Travel', merchant: 'Uber', amount: '₹550.00', status: 'Pending' },
  { date: 'Oct 02, 2025', category: 'Food', merchant: 'Starbucks', amount: '₹820.00', status: 'Approved' },
  { date: 'Sep 28, 2025', category: 'Other', merchant: 'Amazon AWS', amount: '₹2,100.00', status: 'Approved' },
  { date: 'Sep 25, 2025', category: 'Food', merchant: 'Zomato', amount: '₹430.00', status: 'Rejected' },
];

const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Rejected': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
};

const MyExpensesPage = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="My Expenses"
        subtitle="Here is a list of all your submitted expenses."
        action={
          <button onClick={() => setIsPanelOpen(true)} className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Plus size={16} /> New Expense
          </button>
        }
      />

      {/* Expense Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-sm text-slate-600">
            <tr>
              <th className="p-3 font-medium text-left">Date</th>
              <th className="p-3 font-medium text-left">Category</th>
              <th className="p-3 font-medium text-left">Merchant</th>
              <th className="p-3 font-medium text-left">Amount</th>
              <th className="p-3 font-medium text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr key={index} className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => setIsPanelOpen(true)}>
                <td className="p-3 text-slate-700">{exp.date}</td>
                <td className="p-3 text-slate-700">{exp.category}</td>
                <td className="p-3 font-medium text-slate-800">{exp.merchant}</td>
                <td className="p-3 text-slate-700">{exp.amount}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(exp.status)}`}>
                    {exp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* New Expense Panel */}
      <SlideOver title="Submit New Expense" isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
        <ExpenseForm />
      </SlideOver>
    </>
  );
};

// Form component to be placed inside the SlideOver
const ExpenseForm = () => (
  <form className="space-y-5">
    <div>
      <label className="block text-sm font-medium text-slate-600">Merchant</label>
      <input type="text" placeholder="e.g., Uber, Starbucks" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-600">Category</label>
      <select className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        <option>Food</option>
        <option>Travel</option>
        <option>Other</option>
      </select>
    </div>
     <div>
      <label className="block text-sm font-medium text-slate-600">Amount (INR)</label>
      <input type="number" placeholder="550" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
    </div>
     <div>
      <label className="block text-sm font-medium text-slate-600">Date</label>
      <input type="date" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-600">Description</label>
      <textarea placeholder="Client meeting lunch" rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div className="pt-4 flex justify-end">
      <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 font-semibold rounded-lg hover:bg-blue-700">
        Submit Expense
      </button>
    </div>
  </form>
);

export default MyExpensesPage;