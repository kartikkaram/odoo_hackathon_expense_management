import { useEffect, useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "Employee",
    manager: null,
  });
  const [managers, setManagers] = useState([]);

  // ✅ Fetch all users
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin/company-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Fetched users:", data);
        setEmployees(data.data || []);
        setManagers(data.data.filter((u) => u.role === "Manager"));
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (err) {
      console.error("Fetch employees error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, fromEmail: "admin@company.com" }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setFormData({ username: "", email: "", role: "Employee", manager: null });
        fetchEmployees(); // refresh list
      } else {
        alert(data.message || "Error creating user");
      }
    } catch (err) {
      console.error("Create user error:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <PageHeader
        title="Employee Management"
        subtitle="View, add, or manage employees in your organization."
        action={
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={16} /> Add Employee
          </button>
        }
      />

      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <p className="p-4 text-slate-500">Loading...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 text-sm text-slate-600">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Manager</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.email} className="border-t hover:bg-slate-50">
                  <td className="p-3">{emp.username}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.role}</td>
                  <td className="p-3">{emp.manager || "N/A"}</td>
                  <td className="p-3 text-center">
                    <button className="text-slate-500 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Form (Modal Style) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create Employee</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
                required
              />
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option>Admin</option>
                <option>Manager</option>
                <option>Employee</option>
                <option>Finance</option>
                <option>CFO</option>
              </select>
              <select
                value={formData.manager}
                onChange={(e) =>
                  setFormData({ ...formData, manager: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
                disabled={managers.length === 0}
              >
                <option value="">Select Manager</option>
                {managers.map((m) => (
                  <option key={m._id} value={m.username}>
                    {m.username}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeListPage;
