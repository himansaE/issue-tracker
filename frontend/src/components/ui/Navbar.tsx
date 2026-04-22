import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Clipboard } from 'iconsax-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-white/5 bg-surface-900/60 backdrop-blur-md sticky top-0 z-40 transition-content">
      <div className="w-full mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Clipboard variant="Bulk" color="currentColor" className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight">Issue Tracker</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-surface-800 rounded-full pl-1 pr-3 py-1 border border-white/5 max-w-[160px] md:max-w-[240px]">
            <div className="w-6 h-6 shrink-0 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white tracking-widest shadow-inner overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'
              )}
            </div>
            <span className="text-sm font-medium text-slate-300 truncate">
              {user?.name}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white transition-content focus:outline-none focus:text-brand-400 sm:ml-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
