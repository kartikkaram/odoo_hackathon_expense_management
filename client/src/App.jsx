import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Layout and Page Imports
import DashboardLayout from './components/layout/DashboardLayout'; // Assuming you have this
import LoginPage from './pages/LoginPage';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeListPage from './pages/admin/EmployeeListPage';
import ApprovalRulesPage from './pages/admin/ApprovalRulesPage';
// Other role pages...
import MyExpensesPage from './pages/employee/MyExpensesPage';
import ApprovalsPage from './pages/manager/ApprovalsPage';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<EmployeeListPage />} /> {/* New */}
          <Route path="rules" element={<ApprovalRulesPage />} />   {/* New */}
        </Route>

        {/* Employee Routes */}
        <Route path="/employee" element={<DashboardLayout role="employee" />}>
           <Route index element={<MyExpensesPage />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager" element={<DashboardLayout role="manager" />}>
           <Route index element={<ApprovalsPage />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;