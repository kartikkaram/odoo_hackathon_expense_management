import { Upload } from 'lucide-react';

const expenses = [
  { id: 'EXP001', date: '2025-09-28', category: 'Travel', amount: '₹5000 (~$60)', status: 'Approved' },
  { id: 'EXP002', date: '2025-10-02', category: 'Meals', amount: '₹1200 (~$14)', status: 'Pending' },
  { id: 'EXP003', date: '2025-10-03', category: 'Misc', amount: '₹800 (~$9.5)', status: 'Rejected' },
];

const EmployeeDashboard = () => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
      
      {/* Expense Submission Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Submit a New Expense</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Amount</label>
              <input type="number" placeholder="5000" className="w-full mt-1 p-2 border rounded-md"/>
              <p className="text-xs text-gray-500 mt-1">Entered Amount: ₹5000 (Converted: $60.02)</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select className="w-full mt-1 p-2 border rounded-md bg-white">
                <option>Travel</option>
                <option>Meals</option>
                <option>Accommodation</option>
                <option>Misc</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea placeholder="Client meeting lunch" className="w-full mt-1 p-2 border rounded-md"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Receipt Upload</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-600">Drag & drop or <span className="text-indigo-600">browse</span></p>
                  <p className="text-xs text-gray-500">✨ We'll try to auto-fill details with OCR!</p>
                </div>
              </div>
            </div>
            <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Submit Expense</button>
          </form>
        </div>
      </section>

      {/* Expense History */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Expense History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.map(exp => (
            <div key={exp.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{exp.category}</p>
                  <p className="text-sm text-gray-500">{exp.id} | {exp.date}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(exp.status)}`}>
                  {exp.status}
                </span>
              </div>
              <p className="text-2xl font-light mt-4">{exp.amount}</p>
              {exp.status === 'Rejected' && <p className="text-xs text-red-600 mt-2">Reason: Missing itemized receipt.</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;