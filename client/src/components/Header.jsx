import { Bell, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
      <div className="flex items-center gap-6">
        <Bell size={20} className="text-gray-500" />
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40" // Placeholder avatar
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">Alex Turner</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <ChevronDown size={16} className="text-gray-500 cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Header;