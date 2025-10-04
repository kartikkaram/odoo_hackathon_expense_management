import { Users, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom'; // Make sure to install react-router-dom
import { PageHeader } from '../../components/layout/PageHeader';

const StatCard = ({ title, value, icon, linkTo }) => (
  <Link to={linkTo} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className="bg-blue-100 p-2 rounded-lg">
        {icon}
      </div>
    </div>
  </Link>
);

const AdminDashboard = () => {
  return (
    <div>
      <PageHeader
        title="Welcome, Admin!"
        subtitle="Get a high-level overview of your organization's activity."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Employees" value="15" icon={<Users className="text-blue-600" />} linkTo="/admin/employees" />
        <StatCard title="Approval Rules" value="4" icon={<ShieldCheck className="text-blue-600" />} linkTo="/admin/rules" />
        <StatCard title="Pending Expenses" value="8" icon={<FileText className="text-blue-600" />} linkTo="/manager/approvals" />
      </div>
      
      {/* You can add charts or recent activity feeds here */}
    </div>
  );
};

// You'd also create the actual list pages like EmployeeListPage.jsx, etc.
// This example focuses on the main dashboard redesign.

export default AdminDashboard;