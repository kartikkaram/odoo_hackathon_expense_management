import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ role }) => {
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          {/* The Outlet renders the specific page component for the current route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;