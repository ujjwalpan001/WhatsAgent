import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import ConversationList from "../components/ConversationList";
import ChatThread from "../components/ChatThread";
import { themeFor } from "../tenants";

export default function LiveChats({ tenantId }) {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);

  const theme = themeFor(tenantId);

  const loadSessions = useCallback(() => {
    if (!tenantId || document.hidden) return;
    api.getSessions(tenantId).then((d) => setSessions(d.sessions)).catch(console.error);
  }, [tenantId]);

  useEffect(() => {
    loadSessions();
    const id = setInterval(loadSessions, 5000);
    return () => clearInterval(id);
  }, [loadSessions]);

  const loadMessages = useCallback(() => {
    if (!activeSession || document.hidden) return;
    api.getMessages(activeSession.session_id).then((d) => setMessages(d.messages)).catch(console.error);
  }, [activeSession]);

  useEffect(() => {
    loadMessages();
    const id = setInterval(loadMessages, 3000);
    return () => clearInterval(id);
  }, [loadMessages]);

  useEffect(() => {
    setActiveSession(null);
    setMessages([]);
  }, [tenantId]);

  useEffect(() => {
    if (!activeSession || sessions.length === 0) return;
    const fresh = sessions.find((s) => s.session_id === activeSession.session_id);
    if (!fresh) { setActiveSession(null); setMessages([]); }
    else if (fresh.status !== activeSession.status) setActiveSession(fresh);
  }, [sessions, activeSession]);

  return (
    <div className="flex h-full w-full">
      {/* Left: Conversation List */}
      <section className="w-[380px] shrink-0 flex flex-col border-r border-hair bg-surface">
        <header className="px-5 pt-5 pb-4 border-b border-hair">
          <h2 className="text-[16px] font-display font-semibold mb-1">Live Monitor</h2>
          <div className="flex items-center gap-1.5 text-[12px] text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span>Active Agent: {theme.persona || "Default Bot"}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <ConversationList
            sessions={sessions}
            activeId={activeSession?.session_id}
            onSelect={setActiveSession}
          />
        </div>
      </section>

      {/* Right: Chat Thread */}
      <main className="flex-1 min-w-0 flex flex-col bg-canvas">
        <ChatThread session={activeSession} messages={messages} onChanged={loadSessions} />
      </main>
    </div>
  );
}
