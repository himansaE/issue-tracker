import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterInput } from '../types/auth';
import { useAuthStore } from '../store/authStore';
import { registerUser } from '../lib/api/auth';
import { Clipboard } from 'iconsax-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState<RegisterInput>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Partial<RegisterInput>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(parsed.data);
      login(data.data.user, data.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fields: { id: keyof RegisterInput; label: string; type: string; placeholder: string; autoComplete: string }[] = [
    { id: 'name',     label: 'Full name', type: 'text',     placeholder: 'Jane Doe',        autoComplete: 'name' },
    { id: 'email',    label: 'Email',     type: 'email',    placeholder: 'you@example.com', autoComplete: 'email' },
    { id: 'password', label: 'Password',  type: 'password', placeholder: '8+ characters',   autoComplete: 'new-password' },
  ];

  return (
    <div className="flex min-h-screen bg-surface-900 overflow-hidden font-sans">
      
      {/* ─── LEFT: Visual Splash ─── */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-800 border-r border-white/5 items-center justify-center p-12 overflow-hidden">
        {/* Soft abstract blur elements */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-md shadow-2xl">
            <Clipboard variant="Bulk" color="currentColor" className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="font-heading text-5xl font-semibold leading-[1.1] mb-6 tracking-tight">
            Ship faster with the ultimate workspace.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed font-light">
            Start tracking issues, managing roadmaps, and organizing technical sprints with a fully integrated suite for developers.
          </p>

          <div className="mt-12 flex flex-col gap-4 relative">
            {/* Floating Issue Ticket */}
            <div className="bg-surface-800/80 border border-white/10 p-5 rounded-2xl shadow-2xl w-80 transform -rotate-2 backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                  <span className="text-xs text-slate-300 font-semibold tracking-wider">ISSUE-402</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                </div>
              </div>
              <div className="text-sm text-slate-100 font-medium leading-relaxed">
                Migrate authentication pipeline to stateless JWT architecture
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=transparent" alt="avatar" className="w-6 h-6 rounded-full border border-surface-800 bg-surface-700" />
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sam&backgroundColor=transparent" alt="avatar" className="w-6 h-6 rounded-full border border-surface-800 bg-surface-700" />
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-md">IN PROGRESS</span>
              </div>
            </div>

            {/* Glowing Action Card */}
            <div className="absolute -bottom-6 right-8 bg-brand-600 border border-brand-400/50 p-4 rounded-xl shadow-[0_10px_40px_rgba(79,70,229,0.4)] w-64 transform translate-x-8 rotate-3 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white font-bold">Pull Request merged</div>
                  <div className="text-xs text-brand-200">Deployed to production</div>
                </div>
              </div>
            </div>
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
            <h2 className="font-heading text-3xl font-semibold text-white tracking-tight mb-2">Create an account</h2>
            <p className="text-slate-400">Join Issue Tracker and start building today.</p>
          </div>

          <div className="animate-enter" style={{ animationDelay: '50ms' }}>
            {serverError && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {fields.map(({ id, label, type, placeholder, autoComplete }) => (
                <div key={id}>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor={id}>
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    autoComplete={autoComplete}
                    value={form[id]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-xl bg-surface-800 border focus:bg-surface-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-[border-color,background-color,box-shadow] duration-[200ms] ease-ui-out shadow-sm ${errors[id] ? 'border-red-500/60' : 'border-white/10'}`}
                  />
                  {errors[id] && <p className="mt-1.5 text-xs text-red-400">{errors[id]}</p>}
                </div>
              ))}

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
                    {loading ? 'Start building…' : 'Start building'}
                </span>
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="inline-block text-white hover:text-brand-300 font-semibold transition-[transform,color] duration-[160ms] ease-ui-out active:scale-[0.97]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
