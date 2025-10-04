import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PageHeader } from '../../components/layout/PageHeader';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';

const ApprovalWorkflowPage = () => {
  const { id } = useParams(); // Get id from URL, e.g., /approve/expense/:id
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [mandatoryApprovers, setMandatoryApprovers] = useState([]);
  const [enforceSequence, setEnforceSequence] = useState(true);
  const [percentage, setPercentage] = useState(100);
  
  // Component State
  const [potentialApprovers, setPotentialApprovers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set a default name based on the expense ID
    setName(`Approval Flow for Expense #${id.slice(-6)}`);

    // Fetch the list of managers (potential approvers) from the backend
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication error. Please log in again.");
          navigate('/login');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/manager`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          const managers = response.data.data;
          setPotentialApprovers(managers);
          // Set the default selected approver in the dropdown
          if (managers.length > 0) {
            setSelectedApprover(managers[0]._id);
          }
        } else {
            toast.error("Failed to parse approvers list from server.");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Could not fetch managers.";
        toast.error(errorMessage);
      }
    };

    fetchManagers();
  }, [id, navigate]);

  const handleAddApprover = () => {
    if (!selectedApprover) return;

    // Prevent adding the same approver twice
    if (mandatoryApprovers.find(a => a._id === selectedApprover)) {
        toast.error('This user is already in the approvers list.');
        return;
    }
    
    const approverToAdd = potentialApprovers.find(u => u._id === selectedApprover);
    if (approverToAdd) {
        setMandatoryApprovers([...mandatoryApprovers, approverToAdd]);
    }
  };

  const handleRemoveApprover = (approverId) => {
    setMandatoryApprovers(mandatoryApprovers.filter(a => a._id !== approverId));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (mandatoryApprovers.length === 0) {
        toast.error("Please add at least one approver.");
        setIsLoading(false);
        return;
    }

    const payload = {
        name,
        enforceSequence,
        mandatoryApprovers: mandatoryApprovers.map(a => a._id),
        ruleType: "Percentage",
        ruleConfig: {
            percentage: Number(percentage)
        },
    };

    try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/approval-submit/${id}`, payload);
        
        if (response.data.success) {
            toast.success('Approval flow created successfully!');
            navigate(`/expenses/${id}`);
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <>
      <PageHeader
        title="Create Approval Flow"
        subtitle={`Configure approvers and conditions for this expense.`}
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md">
        {/* --- Rule Details Section --- */}
        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="ruleName" className="block text-sm font-medium text-slate-600">Flow Name</label>
            <input 
              type="text" 
              id="ruleName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full md:w-2/3 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* --- Approvers & Conditions Section --- */}
        <div className="p-5 border-t border-slate-200">
          <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg">
            {/* Approvers List */}
            <div className="mt-4">
              <h3 className="text-base font-semibold text-slate-800 mb-3">Approvers</h3>
              <div className="space-y-2 mb-4">
                {mandatoryApprovers.length > 0 ? (
                    mandatoryApprovers.map((approver, index) => (
                      <div key={approver._id} className="flex items-center gap-3 p-2 rounded-md bg-slate-50 border border-slate-200">
                        <span className="text-sm font-bold text-slate-500">{index + 1}</span>
                          {/* Assuming user object has an 'avatar' property */}
                        <img src={approver.avatar || `https://i.pravatar.cc/40?u=${approver._id}`} alt={approver.name} className="w-8 h-8 rounded-full" />
                        <span className="flex-1 font-medium text-slate-700">{approver.name}</span>
                        <button type="button" onClick={() => handleRemoveApprover(approver._id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                      </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No approvers added yet.</p>
                )}
              </div>
              {/* Add Approver Control */}
              <div className="flex items-center gap-2">
                 <select 
                    value={selectedApprover} 
                    onChange={(e) => setSelectedApprover(e.target.value)}
                    className="flex-grow px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={potentialApprovers.length === 0}
                 >
                  {potentialApprovers.length > 0 ? (
                      potentialApprovers.map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))
                  ) : (
                    <option>Loading approvers...</option>
                  )}
                 </select>
               <button type="button" onClick={handleAddApprover} className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:bg-slate-400" disabled={potentialApprovers.length === 0}>
                  <PlusCircle size={16}/> Add
               </button>
              </div>
            </div>
            
            {/* Flow Logic */}
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-4">
               <div className="flex items-start">
                <input 
                    type="checkbox" 
                    id="approverSequence"
                    checked={enforceSequence}
                    onChange={(e) => setEnforceSequence(e.target.checked)}
                    className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <div className="ml-3 text-sm">
                  <label htmlFor="approverSequence" className="font-medium text-slate-800">Enforce approver sequence</label>
                  <p className="text-slate-500">If checked, the request goes to approvers in the defined order.</p>
                </div>
              </div>

               <div className="flex items-center gap-3">
                  <label htmlFor="minPercentage" className="text-sm font-medium text-slate-800">Minimum Approval Percentage:</label>
                  <input 
                        type="number" 
                        id="minPercentage" 
                        placeholder="100" 
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        min="1"
                        max="100"
                        className="w-24 px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                  <span className="text-lg font-medium text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="p-5 border-t border-slate-200 flex justify-end items-center gap-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button 
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" size={18}/>}
            {isLoading ? "Saving..." : "Save Flow"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ApprovalWorkflowPage;