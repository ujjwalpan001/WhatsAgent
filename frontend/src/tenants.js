// Per-tenant visual identity. The console re-themes to the active tenant's accent.
export const TENANT_THEME = {
  tenant_a: {
    accent: "#F59E0B",        // Neon Amber 
    accentSoft: "rgba(245, 158, 11, 0.1)",
    initial: "L",
    kind: "Luxury Furniture",
    persona: "Aria · design concierge",
  },
  tenant_b: {
    accent: "#06B6D4",        // Neon Cyan 
    accentSoft: "rgba(6, 182, 212, 0.1)",
    initial: "A",
    kind: "Automotive Care",
    persona: "Max · service advisor",
  },
};

export const FALLBACK_THEME = {
  accent: "#6366F1",
  accentSoft: "rgba(99, 102, 241, 0.1)",
  initial: "•",
  kind: "Tenant",
  persona: "",
};

export const themeFor = (id) => TENANT_THEME[id] || FALLBACK_THEME;

export const STATUS = {
  WAITING_FOR_BOT: { label: "Bot active", dot: "#10B981", text: "#34D399", bg: "rgba(16, 185, 129, 0.1)" },
  AGENT_RESPONDING: { label: "Replying…", dot: "#10B981", text: "#34D399", bg: "rgba(16, 185, 129, 0.1)" },
  RESOLVED: { label: "Resolved", dot: "#71717A", text: "#A1A1AA", bg: "rgba(113, 113, 122, 0.15)" },
  NEEDS_HUMAN: { label: "Needs human", dot: "#EF4444", text: "#F87171", bg: "rgba(239, 68, 68, 0.15)" },
};

// Which statuses each dashboard filter shows.
export const STATUS_FILTERS = {
  active: ["WAITING_FOR_BOT", "AGENT_RESPONDING"], // open & bot-managed
  RESOLVED: ["RESOLVED"],
  NEEDS_HUMAN: ["NEEDS_HUMAN"],
};
