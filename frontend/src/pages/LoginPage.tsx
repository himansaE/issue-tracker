import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginInput } from '../types/auth';
import { useAuthStore } from '../store/authStore';
import { loginUser } from '../lib/api/auth';
import { Clipboard } from 'iconsax-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState<LoginInput>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginInput>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(parsed.data);
      login(data.data.user, data.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-900 overflow-hidden font-sans">
      
      {/* ─── LEFT: Visual Splash (Hidden on mobile, split on Desktop) ─── */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-800 border-r border-white/5 items-center justify-center p-12 overflow-hidden">
        {/* Soft abstract blur elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/40 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-md shadow-2xl">
            <Clipboard variant="Bulk" color="currentColor" className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="font-heading text-5xl font-semibold leading-[1.1] mb-6 tracking-tight">
            Stop losing track of what matters.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed font-light">
            Issue Tracker gives your team a single source of truth for every project. Built for speed, designed for clarity.
          </p>

          <div className="mt-12 flex items-center gap-4">
             <div className="flex -space-x-4">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-surface-800 bg-surface-700 flex items-center justify-center overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=transparent`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <p className="text-sm text-slate-500 font-medium tracking-tight">Join 10,000+ teams worldwide.</p>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Form Container ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          
          <div className="mb-10 animate-enter" style={{ animationDelay: '0px' }}>
            {/* Mobile-only logo */}
            <div className="lg:hidden w-12 h-12 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center mb-6 shadow-xl">
              <Clipboard variant="Bulk" color="currentColor" className="w-6 h-6 text-brand-400" />
            </div>
            <h2 className="font-heading text-3xl font-semibold text-white tracking-tight mb-2">Welcome back</h2>
            <p className="text-slate-400">Please enter your details to sign in.</p>
          </div>

          <div className="animate-enter" style={{ animationDelay: '50ms' }}>
            {serverError && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl bg-surface-800 border focus:bg-surface-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-[border-color,background-color,box-shadow] duration-[200ms] ease-ui-out shadow-sm ${errors.email ? 'border-red-500/60' : 'border-white/10'}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                   <label className="block text-sm font-medium text-slate-300" htmlFor="password">
                     Password
                   </label>
                   <a href="#" className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</a>
                </div>
                
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl bg-surface-800 border focus:bg-surface-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-[border-color,background-color,box-shadow] duration-[200ms] ease-ui-out shadow-sm ${errors.password ? 'border-red-500/60' : 'border-white/10'}`}
                />
                {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 group transition-[transform,background-color,box-shadow,opacity] duration-[160ms] ease-ui-out active:scale-[0.98] shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:shadow-[0_0_25px_rgba(79,70,229,0.3)] ring-1 ring-white/10 ring-inset"
              >
                <div className={`relative flex items-center justify-center transition-all duration-[250ms] ${loading ? 'opacity-100' : 'opacity-0 scale-75 hidden'}`}>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <span className={`transition-all duration-[250ms] ${loading ? 'blur-[2px] opacity-70' : 'blur-0 opacity-100'}`}>
                    {loading ? 'Signing in…' : 'Sign in'}
                </span>
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="inline-block text-white hover:text-brand-300 font-semibold transition-[transform,color] duration-[160ms] ease-ui-out active:scale-[0.97]">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
