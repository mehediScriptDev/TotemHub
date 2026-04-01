import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { Input, Button } from '../../../Components/ui';
import { Mail, Lock, Zap, Monitor } from 'lucide-react';
import { isValidEmail } from '../../../utils/validators';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* ── Left: Branding Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-surface-950 to-brand-800" />

        {/* Decorative Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-600/8 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-600/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Totem<span className="text-brand-400">Hub</span>
              </h1>
              <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">
                Management Platform
              </p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Control your
            <br />
            <span className="gradient-text">digital signage</span>
            <br />
            from anywhere.
          </h2>
          <p className="text-lg text-surface-400 max-w-md leading-relaxed">
            Manage totems, upload media, curate product showcases, and deploy content — all from a single, powerful dashboard.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {['Video Management', 'Product Curation', 'Real-time Control'].map(
              (feature) => (
                <span
                  key={feature}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10
                             text-sm text-surface-300 backdrop-blur-sm"
                >
                  {feature}
                </span>
              )
            )}
          </div>

          {/* Floating Device Mockup */}
          <div className="mt-12 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-xs">
            <Monitor className="w-10 h-10 text-brand-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">12 Totems Active</p>
              <p className="text-xs text-surface-400">All systems operational</p>
            </div>
            <div className="ml-auto w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse-dot" />
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-surface-100">
              Totem<span className="text-brand-400">Hub</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-surface-100 mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-surface-400">
              Sign in to access your management dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@company.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full !py-3 text-base"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-surface-600">
            © {new Date().getFullYear()} TotemHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
