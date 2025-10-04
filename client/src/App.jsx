import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Employee Routes */}
        <Route path="/employee" element={<DashboardLayout role="employee" />}>
          <Route index element={<EmployeeDashboard />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager" element={<DashboardLayout role="manager" />}>
          <Route index element={<ManagerDashboard />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;