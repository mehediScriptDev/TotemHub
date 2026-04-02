import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { Button, Input } from "../../../Components/ui";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-gray-100 animate-in">
      {/* --- LEFT: BRANDING (DESKTOP ONLY) --- */}
      <div className="hidden lg:flex flex-col justify-between p-20 bg-linear-to-br from-surface-900 to-surface-800 border-r border-surface-700 relative overflow-hidden">
        {/* Optional background image (place /assets/login-left.jpg in public to use) */}
        {/* <div className="absolute inset-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrKoKT-5lhsXaEad8oe53y_kpwnm0XgDM0sQ&s"
            alt="brand"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div> */}
        {/* Background Pattern (accent circles) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-brand-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-brand-500 rounded-full blur-3xl"></div>
        </div>

        {/* Top logo removed as requested */}

        {/* Middle Section - Value Proposition */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
              Manage Your Totems
              <br />
              From Anywhere
            </h2>
            <p className="text-base font-medium text-surface-300 leading-relaxed">
              Real-time control and monitoring of your digital signage network
              with enterprise-grade security.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  Fast Synchronization
                </p>
                <p className="text-xs text-surface-400 mt-1">
                  Updates propagate instantly across all devices
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center shrink-0 mt-1">
                <ShieldCheck className="w-4 h-4 text-brand-500" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  Enterprise Security
                </p>
                <p className="text-xs text-surface-400 mt-1">
                  End-to-end encryption with 99.9% uptime SLA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright removed as requested */}
      </div>

      {/* --- RIGHT: LOGIN FORM --- */}
      <div className="flex items-center justify-center p-8 md:p-16 lg:p-20 bg-surface-50">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Centered Brand (matches design) */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-black text-surface-900 tracking-tight">
              TOTEMHUB
            </h1>
            <p className="text-lg font-semibold text-surface-600 mt-2">
              ADMIN PANEL
            </p>
          </div>

          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight">
              Admin Access
            </h2>
            <p className="text-base font-medium text-surface-600">
              Enter your administrator credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-surface-700 uppercase tracking-widest"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                icon={Mail}
                required
                className="h-11 bg-white border border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-surface-700 uppercase tracking-widest"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                icon={Lock}
                required
                className="h-11 bg-white border border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full h-11 mt-4 font-bold uppercase tracking-wider text-sm shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="pt-6"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
