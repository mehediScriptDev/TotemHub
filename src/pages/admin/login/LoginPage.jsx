import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../Components/ui";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
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
      <div className="hidden lg:flex flex-col items-center justify-center p-20 bg-linear-to-br from-surface-900 to-surface-800 border-r border-surface-700 relative overflow-hidden text-center">
        {/* Optional background image (place /assets/login-left.jpg in public to use) */}
        <div className="absolute inset-0">
          <img
            src="/login.png"
            alt="brand"
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-black/30"></div> */}
        </div>
        {/* Background Pattern (accent circles) */}
        {/* <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-brand-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-brand-500 rounded-full blur-3xl"></div>
        </div> */}

        {/* Top logo removed as requested */}

        {/* Middle Section - Value Proposition */}
        <div className="relative z-10 space-y-6 max-w-xl">
          {/* <div className="space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
              Manage Your Totems
              <br />
              From Anywhere
            </h2>
            <p className="text-base font-medium text-surface-200 leading-relaxed">
              Real-time control and monitoring of your digital signage network
              with enterprise-grade security.
            </p>
          </div> */}

          {/* feature bullets removed as requested */}
        </div>

        {/* Bottom copyright removed as requested */}
      </div>

      {/* --- RIGHT: LOGIN FORM --- */}
      <div className="flex items-start justify-center px-8 md:px-16 lg:px-20 pt-12 md:pt-16 lg:pt-24 bg-surface-50">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Centered Brand (matches design) */}
          <div className="flex flex-col items-center mb-30 lg:mb-28 xl:mb-30">
            <h1 className="text-4xl font-black text-surface-900 tracking-tight">
              TOTEMHUB
            </h1>
            <p className="text-lg font-semibold text-surface-600 mt-2">
              ADMIN PANEL
            </p>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight">
              Admin Access
            </h2>
            <p className="text-base font-medium text-surface-600">
              Enter your administrator credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              {(activeField === "email" || formData.email) && (
                <label
                  htmlFor="email"
                  className="absolute left-4 -top-2 px-1 text-sm font-medium bg-white text-surface-700"
                >
                  Email *
                </label>
              )}
              <input
                id="email"
                type="email"
                aria-label="Email"
                placeholder={activeField === "email" || formData.email ? "" : "Email *"}
                value={formData.email}
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className={`w-full h-14 rounded-2xl border bg-white px-4 text-base text-surface-700 placeholder:text-surface-500 outline-none caret-surface-900 transition-all ${
                  activeField === "email"
                    ? "border-surface-900 ring-1 ring-surface-900/20"
                    : "border-surface-200"
                }`}
              />
            </div>

            <div className="relative">
              {(activeField === "password" || formData.password) && (
                <label
                  htmlFor="password"
                  className="absolute left-4 -top-2 px-1 text-sm font-medium bg-white text-surface-700"
                >
                  Password *
                </label>
              )}
              <input
                id="password"
                type="password"
                aria-label="Password"
                placeholder={activeField === "password" || formData.password ? "" : "Password *"}
                value={formData.password}
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField(null)}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className={`w-full h-14 rounded-2xl border bg-white px-4 text-base text-surface-700 placeholder:text-surface-500 outline-none caret-surface-900 transition-all ${
                  activeField === "password"
                    ? "border-surface-900 ring-1 ring-surface-900/20"
                    : "border-surface-200"
                }`}
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
