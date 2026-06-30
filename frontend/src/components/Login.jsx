import { useState } from "react";
import { login, signup } from "../api/client";

/* WhatsApp-branded premium auth page — split layout */
export default function Login({ onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  return (
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #061A0E 0%, #0A2614 50%, #061409 100%)" }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #25D366 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #25D366 0%, transparent 70%)" }} />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(37,211,102,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(37,211,102,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #25D366, #128C4E)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.4 8.4 0 01-12 7.6L3 21l1.9-5.8A8.5 8.5 0 1121 11.5z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-white font-bold text-[18px] tracking-tight">WhatsAgent</span>
        </div>

        {/* Center content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-[12px] font-medium"
            style={{ background: "rgba(37,211,102,0.12)", color: "#4ade80", border: "1px solid rgba(37,211,102,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            AI-Powered WhatsApp Agent
          </div>
          <h1 className="text-white font-bold text-[42px] leading-[1.1] mb-6 tracking-tight">
            Your business,<br />
            <span style={{ color: "#25D366" }}>always online.</span>
          </h1>
          <p className="text-[16px] leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
            Connect your WhatsApp number, upload your documents,
            and let your AI agent handle customer conversations 24/7.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: "💬", text: "AI agent replies to WhatsApp messages instantly" },
              { icon: "📄", text: "Upload PDFs — agent answers from your documents" },
              { icon: "📊", text: "Monitor every conversation live from your dashboard" },
              { icon: "🤝", text: "Take over and reply as a human agent anytime" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[15px]"
                  style={{ background: "rgba(37,211,102,0.1)" }}>
                  {icon}
                </span>
                <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.65)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-[13px] italic" style={{ color: "rgba(255,255,255,0.35)" }}>
            "Your customers get instant answers. You get full visibility."
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative"
        style={{ background: "#080E0A" }}>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #25D366, #128C4E)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.4 8.4 0 01-12 7.6L3 21l1.9-5.8A8.5 8.5 0 1121 11.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-white font-bold text-[16px]">WhatsAgent</span>
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
      <h2 className="text-white font-bold text-[28px] mb-1 tracking-tight">Welcome back</h2>
      <p className="text-[14px] mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
        Sign in to your WhatsAgent dashboard
      </p>

      <form onSubmit={submit} className="space-y-4">
        <AuthField label="Email" type="email" value={form.email} placeholder="you@company.com"
          onChange={(v) => setForm({ ...form, email: v })} />
        <AuthField label="Password" type="password" value={form.password} placeholder="••••••••"
          onChange={(v) => setForm({ ...form, password: v })} />

        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px]"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-[15px] transition-all duration-200 relative overflow-hidden"
          style={{
            background: loading ? "rgba(37,211,102,0.5)" : "linear-gradient(135deg, #25D366, #1aad52)",
            color: "white",
            boxShadow: loading ? "none" : "0 4px 20px rgba(37,211,102,0.25)"
          }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Signing in…
            </span>
          ) : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Don't have an account?{" "}
          <button onClick={onSwitch} className="font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "#25D366" }}>
            Sign up
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
      <h2 className="text-white font-bold text-[28px] mb-1 tracking-tight">Create account</h2>
      <p className="text-[14px] mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
        Set up your WhatsAgent dashboard
      </p>

      <form onSubmit={submit} className="space-y-4">
        <AuthField label="Full name" type="text" value={form.name} placeholder="Jane Doe"
          onChange={(v) => setForm({ ...form, name: v })} />
        <AuthField label="Email" type="email" value={form.email} placeholder="you@company.com"
          onChange={(v) => setForm({ ...form, email: v })} />
        <AuthField label="Password" type="password" value={form.password} placeholder="Min. 6 characters"
          onChange={(v) => setForm({ ...form, password: v })} />

        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px]"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-[15px] transition-all duration-200"
          style={{
            background: loading ? "rgba(37,211,102,0.5)" : "linear-gradient(135deg, #25D366, #1aad52)",
            color: "white",
            boxShadow: loading ? "none" : "0 4px 20px rgba(37,211,102,0.25)"
          }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Creating account…
            </span>
          ) : "Create account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Already have an account?{" "}
          <button onClick={onSwitch} className="font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "#25D366" }}>
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
      <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wider"
        style={{ color: "rgba(255,255,255,0.45)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
        }}
        onFocus={(e) => { e.target.style.borderColor = "rgba(37,211,102,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,211,102,0.1)"; }}
        onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}
