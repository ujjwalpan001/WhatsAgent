import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Smartphone, RefreshCw, User, Store } from "lucide-react";
import { api, displayUrl } from "../api/client";

const CUSTOMER_PRESETS = [
  { label: "Furniture Customer", phone: "15550001111", icon: Store },
  { label: "Car Mechanic Customer", phone: "15550002222", icon: Store },
  { label: "General Demo User", phone: "15559998888", icon: User },
];

export default function WhatsAppSimulator({ tenantId, activeTenantName, tenants }) {
  const [customerPhone, setCustomerPhone] = useState(CUSTOMER_PRESETS[0].phone);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);

  // Find the active tenant's phone number ID to use in the mock payload
  const activeObj = tenants?.find(t => t.tenant_id === tenantId);
  const phoneNumberId = activeObj?.whatsapp_phone_number_id || "mock_phone_id";

  const chatEndRef = useRef(null);

  // Poll for the session matching this customer phone
  useEffect(() => {
    if (!tenantId || !customerPhone) return;
    const findSession = async () => {
      try {
        const res = await api.getSessions(tenantId);
        const s = (res.sessions || []).find(x => x.customer_phone === customerPhone);
        if (s) {
          setSession(s);
        } else {
          setSession(null);
          setMessages([]);
        }
      } catch(e) {}
    };
    findSession();
    const int = setInterval(findSession, 3000);
    return () => clearInterval(int);
  }, [tenantId, customerPhone]);

  // Poll for messages in that session
  useEffect(() => {
    if (!session) return;
    const fetchMsgs = async () => {
      try {
        const res = await api.getMessages(session.session_id);
        setMessages(res.messages || []);
        // Small delay to allow DOM to render before scrolling
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } catch(e) {}
    };
    fetchMsgs();
    const int = setInterval(fetchMsgs, 2000);
    return () => clearInterval(int);
  }, [session]);

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!tenantId) {
      alert("Please select a tenant to test.");
      return;
    }

    const text = message.trim();
    setMessage("");
    setSending(true);

    // Optimistically add to UI
    const optimisticMsg = {
      id: Date.now().toString(),
      direction: "inbound",
      text: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    const payload = {
      object: "whatsapp_business_account",
      entry: [{
        id: "mock_entry_id",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "Mock Simulator",
              phone_number_id: phoneNumberId
            },
            contacts: [{ profile: { name: "Simulator User" }, wa_id: customerPhone }],
            messages: [{
              from: customerPhone,
              id: "wamid.mock_" + Date.now() + Math.floor(Math.random() * 1000),
              timestamp: Math.floor(Date.now() / 1000).toString(),
              type: "text",
              text: { body: text }
            }]
          },
          field: "messages"
        }]
      }]
    };

    try {
      await api.setRoute(customerPhone, tenantId);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      await fetch(`${baseUrl}/api/webhooks/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Failed to send mock webhook", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink flex items-center gap-2">
            <Smartphone className="text-emerald-500" /> WhatsApp Sandbox Simulator
          </h1>
          <p className="text-[14px] text-muted mt-1">Send simulated webhook payloads to test the RAG Agent pipeline.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left: Configuration */}
        <div className="w-[300px] shrink-0 bg-surface border border-hair rounded-xl p-5 flex flex-col gap-6">
          <div>
            <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Target Tenant</label>
            <div className="px-3 py-2 bg-canvas border border-hair rounded-lg text-[13px] font-medium">
              {activeTenantName || "No Tenant Selected"}
            </div>
            <p className="text-[11px] text-muted mt-2">The bot will route this based on Phone Number ID: <span className="font-mono">{phoneNumberId}</span></p>
          </div>
          
          <div>
            <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Test Identity (Phone)</label>
            <select 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-hair rounded-lg text-[13px] font-medium focus:outline-none focus:border-brand mb-3"
            >
              {CUSTOMER_PRESETS.map(p => (
                <option key={p.phone} value={p.phone}>{p.label} ({p.phone})</option>
              ))}
              <option value="custom">Custom Number...</option>
            </select>
            
            {CUSTOMER_PRESETS.every(p => p.phone !== customerPhone) && (
              <input 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter custom phone (e.g. 15551234567)"
                className="w-full px-3 py-2 bg-canvas border border-brand/50 ring-1 ring-brand/20 rounded-lg text-[13px] font-mono focus:outline-none" 
              />
            )}
            <p className="text-[11px] text-muted mt-2">Chats are saved permanently. Switch identities to start fresh.</p>
          </div>
          
          <div className="mt-auto p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-[12px] text-emerald-500 leading-relaxed font-medium">
              Live Sync Active: The simulator now polls the database in real-time. Bot replies will appear directly in this chat!
            </p>
          </div>
        </div>

        {/* Right: Chat Simulator */}
        <div className="flex-1 flex flex-col bg-surface border border-hair rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-hair flex items-center justify-between bg-canvas">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-emerald-500" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-ink">Simulated Device</div>
                <div className="text-[12px] text-emerald-500">Connected to webhook</div>
              </div>
            </div>
            {session && (
              <span className="px-2 py-1 bg-brand/10 text-brand text-[10px] font-bold rounded uppercase tracking-wider">
                Session Active
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[url('https://i.ibb.co/3mN0Fmb/wa-bg.png')] bg-cover bg-center">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-center">
                <div className="bg-canvas border border-hair px-4 py-2 rounded-lg text-[12px] text-muted shadow-sm">
                  No previous messages. Send a message to start simulating.
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {messages.map((msg, i) => {
                const isInbound = msg.direction === "inbound";
                return (
                  <div key={msg.id || i} className={`flex ${isInbound ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-[14px] leading-relaxed ${
                      isInbound 
                        ? 'bg-emerald-500 text-white rounded-tr-sm' 
                        : 'bg-surface text-ink border border-hair rounded-tl-sm'
                    }`}>
                      {msg.media_url && msg.type === "image" && (
                        <img src={displayUrl(msg.media_url)} alt="Media" className="w-48 rounded-lg mb-2 border border-hair/50" />
                      )}
                      {msg.media_url && msg.type === "document" && (
                        <a href={displayUrl(msg.media_url)} target="_blank" rel="noreferrer" className="block text-brand underline font-medium mb-2 text-[13px]">
                          &#128196; View Document
                        </a>
                      )}
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div className={`text-[10px] mt-1 text-right ${isInbound ? 'text-emerald-100' : 'text-muted'}`}>
                        {isInbound ? 'You' : 'WhatsAgent'}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="p-4 bg-canvas border-t border-hair">
            <div className="flex items-center gap-3">
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message as the customer..."
                className="flex-1 bg-surface border border-hair rounded-full px-5 py-3 text-[14px] focus:outline-none focus:border-brand"
              />
              <button 
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {sending ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
