import { useAuthStore } from '../store/authStore';
import { useIssueStore } from '../store/issueStore';
import { useEffect } from 'react';
import IssueList from '../components/issues/IssueList';
import Navbar from '../components/ui/Navbar';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { fetchIssues } = useIssueStore();
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <div className="min-h-screen bg-surface-900 text-white selection:bg-brand-500/30">
      <Navbar />

      {/* Main */}
      <main className="w-full mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white/95">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-400/80 mt-1.5 text-sm font-medium">Here's what's happening in your workspace right now.</p>
        </div>

        <div className="mt-8">
          <IssueList />
        </div>
      </main>
    </div>
  );
}
