import { useState } from "react";
import { Megaphone, Users, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../api/client";

export default function Broadcasts({ tenantId }) {
  const [phones, setPhones] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { sent: [...], failed: [...] }

  const handleBroadcast = async () => {
    if (!tenantId) {
      alert("Please select a tenant first.");
      return;
    }
    const phoneList = phones
      .split("\n")
      .map(p => p.trim())
      .filter(p => p.length > 5);

    if (phoneList.length === 0) {
      alert("Please enter at least one valid phone number.");
      return;
    }
    if (!message.trim()) {
      alert("Please enter a message to broadcast.");
      return;
    }

    setSending(true);
    setResult(null);
    try {
      const res = await api.broadcast({
        tenant_id: tenantId,
        phone_numbers: phoneList,
        message: message.trim()
      });
      setResult(res);
      if (res.failed && res.failed.length === 0) {
        setPhones("");
        setMessage("");
      }
    } catch (e) {
      alert("Broadcast failed: " + e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Broadcast Campaigns</h1>
          <p className="text-[14px] text-muted mt-1">Send mass messages directly to customer WhatsApp numbers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Composer */}
        <div className="bg-surface border border-hair rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              <Megaphone size={20} className="text-brand" />
            </div>
            <div>
              <h2 className="text-[15px] font-display font-semibold text-ink">Campaign Builder</h2>
              <p className="text-[12px] text-muted">Create your outbound message</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-[12px] font-semibold text-muted uppercase tracking-wider mb-2">
                <Users size={14} /> Audience (Phone Numbers)
              </label>
              <textarea
                value={phones}
                onChange={(e) => setPhones(e.target.value)}
                placeholder="Enter numbers with country code, one per line&#10;e.g. 15551234567&#10;447700900000"
                className="w-full px-4 py-3 bg-canvas border border-hair rounded-lg text-[13px] text-ink focus:outline-none focus:border-brand font-mono leading-relaxed h-32 resize-none"
              />
              <p className="text-[11px] text-muted mt-1.5 text-right">
                {phones.split("\n").filter(p => p.trim().length > 5).length} valid numbers detected
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[12px] font-semibold text-muted uppercase tracking-wider mb-2">
                <MessageSquare size={14} /> Message Content
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hello! Check out our new summer collection..."
                className="w-full px-4 py-3 bg-canvas border border-hair rounded-lg text-[13px] text-ink focus:outline-none focus:border-brand leading-relaxed h-32 resize-none"
              />
            </div>

            <button
              onClick={handleBroadcast}
              disabled={sending}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 mt-2 ${
                sending ? "bg-brand/50 text-white cursor-not-allowed" : "bg-brand text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:bg-brand-deep"
              }`}
            >
              {sending ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Sending Campaign...
                </>
              ) : (
                <>
                  <Send size={16} /> Send to Audience
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-surface border border-hair rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[15px] font-display font-semibold text-ink">Delivery Results</h2>
          </div>

          {!result && !sending && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-canvas border border-hair flex items-center justify-center mb-4">
                <Send size={24} className="text-faint" />
              </div>
              <p className="text-[14px] text-muted">Awaiting broadcast execution...</p>
            </div>
          )}

          {sending && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
               <p className="text-[14px] text-brand animate-pulse font-medium">Transmitting messages to WhatsApp API...</p>
            </div>
          )}

          {result && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {result.sent && result.sent.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-emerald-500 mb-2">
                    <CheckCircle2 size={16} />
                    <span className="font-semibold text-[13px]">Successfully Delivered ({result.sent.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.sent.map(p => (
                      <span key={p} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-[11px] font-mono">
                        +{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.failed && result.failed.length > 0 && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-rose-500 mb-2">
                    <AlertCircle size={16} />
                    <span className="font-semibold text-[13px]">Failed to Deliver ({result.failed.length})</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    {result.failed.map(f => (
                      <div key={f.phone} className="text-[11px] flex items-start gap-2 bg-rose-500/10 p-2 rounded text-rose-400 font-mono">
                        <span className="font-bold shrink-0">+{f.phone}:</span>
                        <span>{f.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
