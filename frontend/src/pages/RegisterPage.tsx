import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clipboard } from 'iconsax-react';
import { registerSchema, type RegisterInput } from '../types/auth';
import { useAuthStore } from '../store/authStore';
import { registerUser } from '../lib/api/auth';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthSplash } from '../components/auth/AuthSplash';
import { AuthHero } from '../components/auth/AuthHero';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
      const { data: result } = await registerUser(parsed.data);
      login(result.user, result.token);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const splash = (
    <AuthSplash variant="register">
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
    </AuthSplash>
  );

  return (
    <AuthLayout splash={splash}>
      <AuthHero 
        title="Create an account" 
        description="Join Issue Tracker and start building today." 
      />

      <div className="animate-enter" style={{ animationDelay: '50ms' }}>
        {serverError && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label="Full name"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            error={errors.name}
          />

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="8+ characters"
            error={errors.password}
          />

          <Button type="submit" loading={loading} className="mt-2">
            Start building
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="inline-block text-white hover:text-brand-300 font-semibold transition-[transform,color] duration-[160ms] ease-ui-out active:scale-[0.97]">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
