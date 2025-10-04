import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Image as ImageIcon, ArrowRight, Building, Globe, DollarSign, AlertCircle, Loader2 } from 'lucide-react';

const SignupPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    companyName: '',
    country: '',
    currency: '',
  });

  // State for countries data from API
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  
  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for image preview
  const [imagePreview, setImagePreview] = useState(null);
  
  const navigate = useNavigate();

  // Fetch countries data on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
        
        const formattedCountries = response.data
          .map(country => {
            const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : null;
            return {
              name: country.name.common,
              currency: currencyCode
            };
          })
          .filter(country => country.currency) // Ensure the country has a currency
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        setCountries(formattedCountries);
      } catch (err) {
        console.error("Failed to fetch countries", err);
        setError("Could not load country list. Please refresh.");
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []); // Empty dependency array ensures this runs only once

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      // Note: The backend controller does not handle file uploads.
      // This image is for frontend preview only in this implementation.
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Special handler for country change to auto-update currency
  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    const selectedCountry = countries.find(c => c.name === selectedCountryName);
    
    setFormData(prevState => ({
      ...prevState,
      country: selectedCountry?.name || '',
      currency: selectedCountry?.currency || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submissionData = { ...formData, role: "Admin" };
      const apiUrl = `${import.meta.env.VITE_BASE_URL}/users/register`;
      const response = await axios.post(apiUrl, submissionData);

      console.log("Registration successful:", response.data);
      setTimeout(() => navigate('/login'), 1000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">ExpenseWise</h1>
          <p className="mt-2 text-gray-500">Create your admin account and company profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400 hover:border-indigo-500 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1.5 border-2 border-white">
                    <ImageIcon size={14} className="text-white" />
                </div>
              </div>
              <input id="image-upload" name="image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Admin Username" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="you@company.com" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="••••••••" />
            </div>
            <hr className="my-2 border-t border-gray-200" />
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input id="companyName" name="companyName" type="text" required value={formData.companyName} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Company Name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select 
                  id="country" 
                  name="country" 
                  required 
                  value={formData.country} 
                  onChange={handleCountryChange} 
                  disabled={countriesLoading}
                  className="appearance-none w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="" disabled>{countriesLoading ? 'Loading...' : 'Select Country'}</option>
                  {countries.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="currency" name="currency" type="text" required value={formData.currency} onChange={handleChange} readOnly className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed" placeholder="Currency" />
              </div>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading || countriesLoading} className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {loading ? <><Loader2 className="animate-spin mr-2" size={16}/> Creating Account...</> : 'Create Account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;