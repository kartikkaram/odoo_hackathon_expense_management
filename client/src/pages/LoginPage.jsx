import { LogIn } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">ExpenseWise</h1>
          <p className="mt-2 text-gray-500">Welcome back! Please sign in.</p>
        </div>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogIn size={16} />
            Sign In
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
          First time?{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up and create your company profile.
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;