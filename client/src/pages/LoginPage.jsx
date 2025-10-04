import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, User, Lock, AlertCircle, Loader2, Mail } from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const apiUrl = `${import.meta.env.VITE_BASE_URL}/users/login`;

            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password
            };

            const response = await axios.post(apiUrl, payload);

            const { user, accessToken, refreshToken } = response.data.data;

            // Save tokens to localStorage
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Log user data and navigate
            console.log("Login successful, user data:", user);
            
            // Redirect to a protected route, e.g., dashboard
            navigate('/dashboard'); 

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
            console.error("Login error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">ExpenseWise</h1>
                    <p className="mt-2 text-gray-500">Welcome back! Please sign in.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Input */}
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Username"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@company.com"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    {/* Forgot Password Link */}
                    <div className="flex items-center justify-end">
                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    
                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {loading ? <><Loader2 className="animate-spin mr-2" size={16}/> Signing In...</> : <><LogIn size={16} /> Sign In</>}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-sm text-center text-gray-500">
                    First time here?{' '}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

