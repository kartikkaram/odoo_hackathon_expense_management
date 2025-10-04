import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import ApprovalStatusTracker from '../components/ApprovalStatusTracker';

// Mock Data
const pendingApprovals = [
  { employee: 'Jane Smith', category: 'Travel', amount: '$60.02', date: '2025-10-02', currentStep: 1 },
  { employee: 'Peter Jones', category: 'Software', amount: '$150.00', date: '2025-10-01', currentStep: 1 },
];
const pieData = [
  { name: 'Travel', value: 400 },
  { name: 'Meals', value: 300 },
  { name: 'Software', value: 300 },
  { name: 'Misc', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ManagerDashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>

      {/* Pending Approvals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {pendingApprovals.map((item, index) => (
              <li key={index} className="p-4 space-y-3">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="font-semibold">{item.employee}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <p className="text-lg">{item.amount}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                  <div className="flex gap-2 justify-end">
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">Reject</button>
                    <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">Approve</button>
                  </div>
                </div>
                {/* Gamified Approval Flow UI */}
                <ApprovalStatusTracker currentStep={item.currentStep} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team Expenses Summary */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Team Expenses Summary (This Month)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Expenses by Category</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center text-center">
            <p className="text-gray-500">Total Submitted by Team</p>
            <p className="text-4xl font-bold mt-2">$1,200.00</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManagerDashboard;