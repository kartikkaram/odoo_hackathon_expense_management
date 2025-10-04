import { Plus, MoreVertical } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';

// Mock Data
const employees = [
  { name: 'John Doe', email: 'john.doe@example.com', role: 'Manager', manager: 'N/A', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026704d' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Employee', manager: 'John Doe', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026705d' },
  { name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Employee', manager: 'John Doe', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026706d' },
  { name: 'Sara Johnson', email: 'sara.j@example.com', role: 'Finance', manager: 'John Doe', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026707d' },
];

const EmployeeListPage = () => {
  return (
    <>
      <PageHeader
        title="Employee Management"
        subtitle="View, add, or manage employees in your organization."
        action={
          <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Plus size={16} /> Add Employee
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-sm text-slate-600">
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
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    emp.role === 'Manager' ? 'bg-sky-100 text-sky-800' :
                    emp.role === 'Finance' ? 'bg-purple-100 text-purple-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
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
    </>
  );
};

export default EmployeeListPage;