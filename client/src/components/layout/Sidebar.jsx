import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, Settings, FileText, BarChart3, HandCoins, SlidersHorizontal } from 'lucide-react';

// Define navigation items for each role
const adminNav = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Employees', icon: Users, path: '/admin/employees' },
//   { name: 'Approval Rules', icon: ShieldCheck, path: '/admin/rules' },
  { name: 'Workflow Editor', icon: SlidersHorizontal, path: '/admin/workflow' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

const employeeNav = [
  { name: 'My Expenses', icon: FileText, path: '/employee' },
  { name: 'Submit Expense', icon: HandCoins, path: '/employee/submit' },
];

const managerNav = [
  { name: 'Approvals', icon: ShieldCheck, path: '/manager' },
  { name: 'Team Expenses', icon: BarChart3, path: '/manager/team' },
];

const navConfig = {
  admin: adminNav,
  employee: employeeNav,
  manager: managerNav,
};

const Sidebar = ({ role }) => {
  const navItems = navConfig[role] || [];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold text-blue-600">
        ExpenseWise
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end // Use 'end' for the Dashboard link to avoid it being always active
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 my-1 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;