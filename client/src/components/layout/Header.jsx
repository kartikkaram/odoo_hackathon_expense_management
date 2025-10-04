import { Bell, ChevronDown, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-9 pr-4 py-2 w-64 text-sm bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-6">
        <Bell size={20} className="text-slate-500 cursor-pointer" />
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40" // Placeholder avatar
            alt="User Avatar"
            className="w-9 h-9 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm text-slate-700">Alex Turner</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
          <ChevronDown size={16} className="text-slate-500 cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Header;