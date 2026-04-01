import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Button, Input } from '../../../Components/ui';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      toast.error(err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-brand-100 animate-in">
      {/* --- LEFT: BRANDING (DESKTOP ONLY) --- */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-surface-50 border-r border-surface-200 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-xl shadow-brand-600/20">
            <Zap className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-surface-900 tracking-tighter uppercase">TotemHub</h1>
            <p className="text-[10px] font-bold text-surface-400 tracking-widest leading-none mt-1 uppercase">Management</p>
          </div>
        </div>

        <div className="space-y-12 relative z-10">
          <h2 className="text-6xl font-black text-surface-900 leading-[1.1] tracking-tight">
            Control your <span className="text-brand-600">signage</span> from anywhere.
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-black text-surface-900 text-sm tracking-tight uppercase">Instant Synchronization</h3>
                <p className="text-xs font-bold text-surface-500 mt-1 uppercase tracking-tighter leading-relaxed">Update your totems across the city in less than a second.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100 shrink-0">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-black text-surface-900 text-sm tracking-tight uppercase">Enterprise Security</h3>
                <p className="text-xs font-bold text-surface-500 mt-1 uppercase tracking-tighter leading-relaxed">Your content is encrypted and safely delivered with 99.9% uptime.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs font-bold text-surface-400 uppercase tracking-widest relative z-10">
          © 2026 TotemHub System • Version 4.0
        </p>
      </div>

      {/* --- RIGHT: LOGIN FORM --- */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-20 relative bg-white">
        <div className="w-full max-w-sm space-y-12">
          {/* Logo - Mobile only */}
          <div className="lg:hidden flex justify-center mb-12">
            <div className="w-16 h-16 rounded-3xl bg-brand-600 flex items-center justify-center shadow-xl shadow-brand-600/30">
              <Zap className="w-8 h-8 text-white" fill="white" />
            </div>
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-4xl font-black text-surface-900 tracking-tight leading-none uppercase">Sign In</h2>
            <p className="text-sm font-bold text-surface-500 uppercase tracking-tighter leading-relaxed underline decoration-brand-500/30 decoration-2 underline-offset-4">
              Enter your admin credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@totem.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={Mail}
                required
                className="!py-3"
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={Lock}
                required
                className="!py-3"
              />
            </div>

            <Button 
                type="submit" 
                loading={loading} 
                size="lg" 
                className="w-full !py-4 shadow-xl shadow-brand-500/20 group uppercase font-black tracking-widest text-xs"
            >
              Access Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-center">
              <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                Protected by <span className="text-brand-500 underline underline-offset-4 pointer-events-none">TotemHub Gateway</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
