import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clipboard } from 'iconsax-react';
import { loginSchema, type LoginInput } from '../types/auth';
import { useAuthStore } from '../store/authStore';
import { loginUser } from '../lib/api/auth';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthSplash } from '../components/auth/AuthSplash';
import { AuthHero } from '../components/auth/AuthHero';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
      const { data: result } = await loginUser(parsed.data);
      login(result.user, result.token);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const splash = (
    <AuthSplash variant="login">
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
          {[1, 2, 3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-surface-800 bg-surface-700 flex items-center justify-center overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=transparent`} alt="avatar" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Join 10,000+ teams worldwide.</p>
      </div>
    </AuthSplash>
  );

  return (
    <AuthLayout splash={splash}>
      <AuthHero 
        title="Welcome back" 
        description="Please enter your details to sign in." 
      />

      <div className="animate-enter" style={{ animationDelay: '50ms' }}>
        {serverError && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            rightElement={
              <a href="#" className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                Forgot password?
              </a>
            }
          />

          <Button type="submit" loading={loading} className="mt-2">
            Sign in
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="inline-block text-white hover:text-brand-300 font-semibold transition-[transform,color] duration-[160ms] ease-ui-out active:scale-[0.97]">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
