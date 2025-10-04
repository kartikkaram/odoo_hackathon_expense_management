import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Layout and Page Imports
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeListPage from './pages/admin/EmployeeListPage';
import ApprovalRulesPage from './pages/admin/ApprovalRulesPage';
import ApprovalWorkflowPage from './pages/admin/ApprovalWorkflowPage';
import MyExpensesPage from './pages/employee/MyExpensesPage';
import ApprovalsPage from './pages/manager/ApprovalsPage';
import SignupPage from './pages/SignupPage';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<EmployeeListPage />} />
          <Route path="rules" element={<ApprovalRulesPage />} />
          <Route path="workflow" element={<ApprovalWorkflowPage />} />
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