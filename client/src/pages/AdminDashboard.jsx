import { Plus, Users, ShieldCheck, Settings, KeyRound } from 'lucide-react';

// Mock Data
const employees = [
  { name: 'John Doe', email: 'john@example.com', role: 'Manager', manager: 'N/A' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'Employee', manager: 'John Doe' },
  { name: 'Peter Jones', email: 'peter@example.com', role: 'Employee', manager: 'John Doe' },
];

// A small, local component for the toggle switch UI
const ToggleSwitch = ({ enabled }) => (
  <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${enabled ? 'translate-x-5' : ''}`}></div>
  </div>
);


const AdminDashboard = () => {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Employee & Manager Management */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Users size={24} /> Employees & Managers</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
            <Plus size={16} /> Add Employee
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Manager Assigned</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">{emp.email}</td>
                  <td className="p-2">
                     <span className={`px-2 py-1 text-xs rounded-full ${emp.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="p-2">{emp.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Approval Rules Config (Hackathon Winning Edge) */}
      <section>
         <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><ShieldCheck size={24} /> Approval Rules Config</h2>
         <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-4 text-gray-600">Drag and drop to reorder the approval sequence.</p>
            <div className="flex items-center space-x-4 text-center">
                {/* Step 1 */}
                <div className="flex-1 p-4 border border-dashed rounded-lg bg-gray-50">
                    <p className="font-bold">Step 1: Manager</p>
                    <p className="text-sm text-gray-500">Approves all expenses from their team.</p>
                </div>
                <span className="text-2xl text-gray-400">→</span>
                {/* Step 2 */}
                <div className="flex-1 p-4 border border-dashed rounded-lg bg-gray-50">
                    <p className="font-bold">Step 2: Finance Dept.</p>
                    <p className="text-sm text-gray-500">Approves if amount > $500.</p>
                </div>
                <span className="text-2xl text-gray-400">→</span>
                {/* Step 3 */}
                <div className="flex-1 p-4 border-2 border-indigo-400 rounded-lg bg-indigo-50 shadow-md">
                    <p className="font-bold text-indigo-800">Step 3: Director</p>
                    <p className="text-sm text-indigo-600">Final approval for amounts > $2000.</p>
                </div>
            </div>
            <button className="mt-6 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                + Add Approval Step
            </button>
         </div>
      </section>
      
      {/* 🌟 NEW: Company Settings Section */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><Settings size={24} /> Company Settings</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input type="text" id="companyName" defaultValue="ExpenseWise Inc." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
              <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700">Default Currency</label>
              <select id="defaultCurrency" className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option>USD - United States Dollar</option>
                <option>EUR - Euro</option>
                <option selected>INR - Indian Rupee</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">Currency Exchange API Key</label>
              <input type="password" id="apiKey" defaultValue="••••••••••••••••" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
          </div>
          <div className="mt-6 text-right">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Save Settings
            </button>
          </div>
        </div>
      </section>

      {/* 🌟 NEW: Role Permissions Matrix Section */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><KeyRound size={24} /> Role Permissions Matrix</h2>
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="p-2 font-semibold">Role</th>
                <th className="p-2 font-semibold text-center">Create Users</th>
                <th className="p-2 font-semibold text-center">Submit Expense</th>
                <th className="p-2 font-semibold text-center">Approve Expense</th>
                <th className="p-2 font-semibold text-center">Override Flow</th>
              </tr>
            </thead>
            <tbody>
              {/* Admin Row */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">Admin</td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
              </tr>
              {/* Manager Row */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">Manager</td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={false} /></td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={false} /></td>
              </tr>
              {/* Employee Row */}
              <tr className="hover:bg-gray-50">
                <td className="p-2 font-medium">Employee</td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={false} /></td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={false} /></td>
                <td className="p-2 flex justify-center"><ToggleSwitch enabled={false} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default AdminDashboard;