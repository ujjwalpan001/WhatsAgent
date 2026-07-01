import { useState, useEffect } from "react";
import { Activity, Server, Clock, CheckCircle2, ChevronRight, TerminalSquare, Search } from "lucide-react";

// Mock LangGraph Execution Data
const MOCK_EXECUTIONS = [
  { id: "exec-9921", customer: "+91 98765 43210", tenant: "Luxury Furniture", status: "completed", duration: "1.2s", time: "Just now" },
  { id: "exec-9920", customer: "+1 555 0192", tenant: "AutoCare", status: "processing", duration: "0.8s", time: "1m ago" },
  { id: "exec-9919", customer: "+44 7700 900077", tenant: "Luxury Furniture", status: "failed", duration: "3.4s", time: "5m ago" },
];

const MOCK_LOGS = [
  { id: 1, type: "info", step: "Webhook Received", detail: "Payload validated and parsed.", time: "0ms" },
  { id: 2, type: "info", step: "Read Receipt Sent", detail: "Dispatched to WhatsApp API.", time: "120ms" },
  { id: 3, type: "info", step: "Typing Indicator Started", detail: "Typing status active.", time: "150ms" },
  { id: 4, type: "system", step: "Context Retrieved", detail: "Fetched 3 RAG chunks and user history.", time: "300ms" },
  { id: 5, type: "success", step: "LLM Reasoning Completed", detail: "Groq (llama-3.3-70b) generated response.", time: "950ms" },
  { id: 6, type: "system", step: "Asset Selected", detail: "Media matched keyword: 'catalog'", time: "980ms" },
  { id: 7, type: "success", step: "Response Dispatched", detail: "Message sent successfully.", time: "1200ms" },
];

export default function AgentMonitoring({ tenantId }) {
  const [selectedExec, setSelectedExec] = useState(MOCK_EXECUTIONS[0]);

  return (
    <div className="flex h-full w-full bg-canvas">
      {/* Left List */}
      <section className="w-[340px] shrink-0 border-r border-hair bg-surface flex flex-col">
        <div className="p-4 border-b border-hair">
          <h2 className="text-[16px] font-display font-semibold mb-3">Live Executions</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              placeholder="Search Execution ID..."
              className="w-full pl-9 pr-3 py-2 bg-canvas border border-hair rounded-lg text-[13px] focus:outline-none focus:border-brand"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_EXECUTIONS.map(exec => (
            <button 
              key={exec.id}
              onClick={() => setSelectedExec(exec)}
              className={`w-full text-left p-4 border-b border-hair hover:bg-canvas transition-colors ${selectedExec.id === exec.id ? "bg-canvas" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-mono text-[13px] font-medium text-ink">{exec.id}</span>
                <span className="text-[11px] text-muted">{exec.time}</span>
              </div>
              <div className="text-[12px] text-muted mb-2">{exec.customer}</div>
              <div className="flex justify-between items-center">
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                  exec.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                  exec.status === 'processing' ? 'bg-brand/10 text-brand' :
                  'bg-rose-500/10 text-rose-500'
                }`}>
                  {exec.status}
                </span>
                <span className="text-[11px] font-mono text-muted flex items-center gap-1">
                  <Clock size={12} /> {exec.duration}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Right Details */}
      <main className="flex-1 flex flex-col min-w-0 p-6 overflow-y-auto">
        <div className="max-w-4xl w-full mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-ink flex items-center gap-2">
                Execution {selectedExec.id}
              </h1>
              <p className="text-[13px] text-muted">{selectedExec.tenant} · LangGraph Agent</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-surface border border-hair rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1">Current State</div>
              <div className="text-[14px] text-ink font-medium capitalize">{selectedExec.status}</div>
            </div>
            <div className="bg-surface border border-hair rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1">Total Duration</div>
              <div className="text-[14px] font-mono text-ink font-medium">{selectedExec.duration}</div>
            </div>
            <div className="bg-surface border border-hair rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1">Active Node</div>
              <div className="text-[14px] font-mono text-brand font-medium">dispatcher_node</div>
            </div>
          </div>

          <h3 className="text-[15px] font-display font-semibold mb-4 flex items-center gap-2">
            <TerminalSquare size={16} className="text-muted" />
            Execution Trace
          </h3>

          <div className="bg-surface border border-hair rounded-xl p-2 relative">
            <div className="absolute left-[31px] top-6 bottom-6 w-px bg-hair" />
            
            <div className="space-y-1">
              {MOCK_LOGS.map((log) => (
                <div key={log.id} className="flex gap-4 p-3 hover:bg-canvas rounded-lg transition-colors group relative z-10">
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-surface border-2 ${
                    log.type === 'success' ? 'border-emerald-500' :
                    log.type === 'info' ? 'border-brand' : 'border-zinc-500'
                  }`}>
                    {log.type === 'success' && <CheckCircle2 size={12} className="text-emerald-500" />}
                    {log.type === 'info' && <ChevronRight size={12} className="text-brand" />}
                    {log.type === 'system' && <Server size={12} className="text-zinc-500" />}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex justify-between items-start">
                    <div>
                      <div className="text-[13px] font-medium text-ink">{log.step}</div>
                      <div className="text-[12px] text-muted mt-0.5">{log.detail}</div>
                    </div>
                    <span className="text-[11px] font-mono text-muted bg-canvas border border-hair px-2 py-0.5 rounded-md">
                      {log.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
