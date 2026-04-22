import { useAuthStore } from '../store/authStore';
import { useIssueStore } from '../store/issueStore';
import { useEffect } from 'react';
import IssueList from '../components/issues/IssueList';
import Navbar from '../components/ui/Navbar';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { fetchIssues, isLoading } = useIssueStore();
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="min-h-screen bg-surface-900 text-white selection:bg-brand-500/30">
      <Navbar />

      {/* Main */}
      <main className="w-full mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white/95 flex items-baseline gap-2">
            Good {greeting},{' '}
            {firstName ? (
              <span>{firstName}</span>
            ) : (
              <span className="skeleton inline-block h-8 w-28 rounded-lg align-middle" />
            )}
          </h1>
          <p className={`mt-1.5 text-sm font-medium transition-opacity duration-300 ${isLoading ? 'text-slate-600' : 'text-slate-400/80'}`}>
            Here's what's happening in your workspace right now.
          </p>
        </div>

        <div className="mt-8">
          <IssueList />
        </div>
      </main>
    </div>
  );
}
