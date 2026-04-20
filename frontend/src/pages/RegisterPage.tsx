import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterInput } from '../types/auth';
import { useAuthStore } from '../store/authStore';
import { registerUser } from '../lib/api/auth';

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
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4 shadow-lg shadow-brand-900">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-400 mt-1">Start tracking issues today</p>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-2xl p-8 shadow-2xl">
          {serverError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
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
                  className={`w-full px-4 py-2.5 rounded-lg bg-surface-700 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${errors[id] ? 'border-red-500/60' : 'border-white/10'}`}
                />
                {errors[id] && <p className="mt-1.5 text-xs text-red-400">{errors[id]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors duration-150 shadow-md"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-200 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
