import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, ShieldCheck, HandCoins, BarChart3 } from 'lucide-react';

const adminNav = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Employees', icon: Users, path: '/admin/employees' },
  { name: 'All Expenses', icon: FileText, path: '/admin/expenses' },
  { name: 'Approval Rules', icon: ShieldCheck, path: '/admin/rules' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

const employeeNav = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/employee' },
  { name: 'My Expenses', icon: FileText, path: '/employee/expenses' },
  { name: 'Submit Expense', icon: HandCoins, path: '/employee/submit' },
];

const managerNav = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/manager' },
  { name: 'Approvals', icon: ShieldCheck, path: '/manager/approvals' },
  { name: 'Team Expenses', icon: BarChart3, path: '/manager/team-expenses' },
];

const navConfig = {
  admin: adminNav,
  employee: employeeNav,
  manager: managerNav,
};

const Sidebar = ({ role }) => {
  const navItems = navConfig[role] || [];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold">
        ExpenseWise
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end // Use 'end' to match only the exact path
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 my-1 rounded-md transition-colors ${
                    isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'
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