import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Clipboard } from 'iconsax-react';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-900 text-white">
      {/* Top navbar */}
      <header className="border-b border-white/5 bg-surface-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Clipboard variant="Bulk" color="currentColor" className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Issue Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              {user?.name}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">Welcome back, {user?.name}! Your workspace is ready.</p>
        </div>

        {/* Placeholder stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Open Issues', value: '0', color: 'text-brand-400' },
            { label: 'In Progress', value: '0', color: 'text-amber-400' },
            { label: 'Closed',      value: '0', color: 'text-emerald-400' },
          ].map((card) => (
            <div key={card.label} className="bg-surface-800 border border-white/5 rounded-xl p-6">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{card.label}</p>
              <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="bg-surface-800 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-700 flex items-center justify-center mb-4">
            <Clipboard variant="Bulk" color="currentColor" className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-200 mb-1">No issues yet</h2>
          <p className="text-sm text-slate-500 max-w-xs">
            Issues will appear here once you create your first project and start tracking work.
          </p>
        </div>
      </main>
    </div>
  );
}
