import { Plus, Users, ShieldCheck, Settings, KeyRound, MoreVertical, GripVertical, Building2 } from 'lucide-react';

// --- Reusable Components (for better structure and styling) ---

const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">{children}</div>
);

const CardHeader = ({ title, icon, action }) => (
  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
    <div className="flex items-center gap-3">
      {icon}
      <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
    </div>
    {action}
  </div>
);

const CardContent = ({ children }) => (
  <div className="p-5 bg-slate-50/50">{children}</div>
);

const ToggleSwitch = ({ enabled }) => (
  <div className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
    <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-5' : ''}`} />
  </div>
);

// --- Mock Data ---
const employees = [
  { name: 'John Doe', email: 'john.doe@example.com', role: 'Manager', manager: 'N/A', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026704d' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Employee', manager: 'John Doe', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026705d' },
  { name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Employee', manager: 'John Doe', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026706d' },
];


const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* --- Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="mt-1 text-slate-500">Manage your company's expenses, employees, and settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column (Main Content) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Employee Management */}
          <Card>
            <CardHeader
              title="Employees & Managers"
              icon={<Users className="text-slate-500" />}
              action={
                <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                  <Plus size={16} /> Add Employee
                </button>
              }
            />
            <div className="p-2">
              <table className="w-full">
                <thead className="text-sm text-slate-500">
                  <tr>
                    <th className="p-3 font-medium text-left">Name</th>
                    <th className="p-3 font-medium text-left">Role</th>
                    <th className="p-3 font-medium text-left">Manager</th>
                    <th className="p-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.email} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full" />
                        <div>
                          <p className="font-semibold text-slate-700">{emp.name}</p>
                          <p className="text-sm text-slate-500">{emp.email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${emp.role === 'Manager' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{emp.manager}</td>
                      <td className="p-3 text-center">
                        <button className="text-slate-500 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Approval Rules */}
          <Card>
            <CardHeader
              title="Approval Rules Workflow"
              icon={<ShieldCheck className="text-slate-500" />}
              action={
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  + Add Step
                </button>
              }
            />
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                {/* Step Item */}
                <div className="flex items-center gap-4 w-full">
                   <div className="bg-white flex-1 p-4 border rounded-lg flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3 text-left">
                        <GripVertical className="cursor-grab text-slate-400" />
                        <div>
                          <p className="font-bold text-slate-700">1. Manager Approval</p>
                          <p className="text-sm text-slate-500">Team lead reviews expense.</p>
                        </div>
                      </div>
                      <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Configure</button>
                   </div>
                   <div className="hidden md:block text-slate-300 font-light text-2xl">→</div>
                </div>
                {/* Step Item */}
                <div className="bg-white flex-1 w-full p-4 border rounded-lg flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-3 text-left">
                     <GripVertical className="cursor-grab text-slate-400" />
                     <div>
                       <p className="font-bold text-slate-700">2. Finance Review</p>
                       <p className="text-sm text-slate-500">For expenses over $500.</p>
                     </div>
                   </div>
                   <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Configure</button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Right Column (Settings & Permissions) --- */}
        <div className="space-y-8">
          {/* Company Settings */}
          <Card>
            <CardHeader title="Company Settings" icon={<Building2 className="text-slate-500" />} />
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-600">Company Name</label>
                  <input type="text" id="companyName" defaultValue="ExpenseWise Inc." className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                  <label htmlFor="defaultCurrency" className="block text-sm font-medium text-slate-600">Default Currency</label>
                  <select id="defaultCurrency" className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option>USD - United States Dollar</option>
                    <option>EUR - Euro</option>
                    <option selected>INR - Indian Rupee</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card>
            <CardHeader title="Role Permissions" icon={<KeyRound className="text-slate-500" />} />
            <div className="p-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500">
                    <th className="p-2 font-medium text-left">Role</th>
                    <th className="p-2 font-medium text-center">Submit</th>
                    <th className="p-2 font-medium text-center">Approve</th>
                    <th className="p-2 font-medium text-center">Manage Users</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="p-2 font-semibold text-slate-700">Admin</td>
                    <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                    <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                    <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                  </tr>
                   <tr className="border-t border-slate-100">
                    <td className="p-2 font-semibold text-slate-700">Manager</td>
                    <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                    <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                    <td className="p-2 flex justify-center"><ToggleSwitch enabled={false} /></td>
                  </tr>
                   <tr className="border-t border-slate-100">
                    <td className="p-2 font-semibold text-slate-700">Employee</td>
                    <td className="p-2 flex justify-center"><ToggleSwitch enabled={true} /></td>
                    <td className="p-2 flex justify-center"><ToggleSwitch enabled={false} /></td>
                    <td className="p-2 flex justify-center"><ToggleSwitch enabled={false} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;