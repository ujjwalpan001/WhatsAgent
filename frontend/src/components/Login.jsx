import { useState } from "react";
import { login, signup } from "../api/client";
import { Bot, ShieldCheck, Zap, LineChart } from "lucide-react";

/* Modern SaaS Auth Page — Split layout */
export default function Login({ onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  return (
    <div className="min-h-screen flex font-sans bg-canvas text-ink">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between p-12 relative overflow-hidden bg-surface border-r border-hair">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "linear-gradient(rgba(250,250,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,250,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.4 8.4 0 01-12 7.6L3 21l1.9-5.8A8.5 8.5 0 1121 11.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-display font-bold text-[18px] tracking-tight">WhatsAgent</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-[12px] font-medium bg-brand/10 text-brand border border-brand/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            Enterprise Multi-Tenant AI Platform
          </div>
          <h1 className="font-display font-bold text-[48px] leading-[1.1] mb-6 tracking-tight">
            Automate support.<br />
            <span className="text-brand">Scale your sales.</span>
          </h1>
          <p className="text-[16px] leading-relaxed mb-10 text-muted">
            Connect your WhatsApp numbers, upload enterprise documentation,
            and deploy highly intelligent RAG agents across multiple tenants instantly.
          </p>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Bot, text: "Llama-3.3 70B Reasoning" },
              { icon: Zap, text: "Instant RAG PDF Search" },
              { icon: ShieldCheck, text: "Multi-Tenant Isolation" },
              { icon: LineChart, text: "Real-time Monitoring" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-canvas border border-hair text-brand">
                  <Icon size={18} />
                </div>
                <span className="text-[14px] font-medium text-ink">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative border-t border-hair pt-6">
          <p className="text-[13px] italic text-muted">
            "We reduced our average response time from 4 hours to 1.2 seconds while handling 10x the chat volume."
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative bg-canvas">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.4 8.4 0 01-12 7.6L3 21l1.9-5.8A8.5 8.5 0 1121 11.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-display font-bold text-[16px]">WhatsAgent</span>
        </div>

        <div className="w-full max-w-[400px]">
          {mode === "login"
            ? <LoginForm onSwitch={() => setMode("signup")} onSuccess={onSuccess} />
            : <SignupForm onSwitch={() => setMode("login")} onSuccess={onSuccess} />}
        </div>
      </div>
    </div>
  );
}

/* ── Login form ── */
function LoginForm({ onSwitch, onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please enter your email and password"); return; }
    setLoading(true); setError("");
    try {
      await login(form.email, form.password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-display font-bold text-[32px] mb-2 tracking-tight">Welcome back</h2>
      <p className="text-[14px] mb-8 text-muted">
        Sign in to your enterprise dashboard
      </p>

      <form onSubmit={submit} className="space-y-4">
        <AuthField label="Email" type="email" value={form.email} placeholder="admin@company.com"
          onChange={(v) => setForm({ ...form, email: v })} />
        <AuthField label="Password" type="password" value={form.password} placeholder="••••••••"
          onChange={(v) => setForm({ ...form, password: v })} />

        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className={`w-full py-3 rounded-xl font-medium text-[14px] transition-all duration-200 mt-2 ${
            loading ? "bg-brand/50 text-white cursor-not-allowed" : "bg-brand text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:bg-brand-deep"
          }`}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Authenticating...
            </span>
          ) : "Sign in to Dashboard"}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-hair pt-6">
        <span className="text-[13px] text-muted">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="font-medium text-brand hover:text-brand-deep transition-colors">
            Create an account
          </button>
        </span>
      </div>
    </div>
  );
}

/* ── Signup form ── */
function SignupForm({ onSwitch, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Please enter your name"); return; }
    if (!form.email.trim()) { setError("Please enter your email"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      await signup(form.name, form.email, form.password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-display font-bold text-[32px] mb-2 tracking-tight">Create account</h2>
      <p className="text-[14px] mb-8 text-muted">
        Start building intelligent WhatsApp agents
      </p>

      <form onSubmit={submit} className="space-y-4">
        <AuthField label="Full Name" type="text" value={form.name} placeholder="Jane Doe"
          onChange={(v) => setForm({ ...form, name: v })} />
        <AuthField label="Work Email" type="email" value={form.email} placeholder="jane@company.com"
          onChange={(v) => setForm({ ...form, email: v })} />
        <AuthField label="Password" type="password" value={form.password} placeholder="Minimum 6 characters"
          onChange={(v) => setForm({ ...form, password: v })} />

        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className={`w-full py-3 rounded-xl font-medium text-[14px] transition-all duration-200 mt-2 ${
            loading ? "bg-brand/50 text-white cursor-not-allowed" : "bg-brand text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:bg-brand-deep"
          }`}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Creating account...
            </span>
          ) : "Start free trial"}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-hair pt-6">
        <span className="text-[13px] text-muted">
          Already have an account?{" "}
          <button onClick={onSwitch} className="font-medium text-brand hover:text-brand-deep transition-colors">
            Sign in
          </button>
        </span>
      </div>
    </div>
  );
}

/* ── Shared input field ── */
function AuthField({ label, type, value, placeholder, onChange }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider text-muted">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-[14px] bg-surface border border-hair text-ink focus:outline-none focus:border-brand transition-colors"
      />
    </div>
  );
}
