# WhatsAgent 🤖

> AI-powered WhatsApp automation platform. Connect your business to WhatsApp, deploy an intelligent AI agent, and monitor every conversation — all from one dashboard.

---

## What is WhatsAgent?

WhatsAgent lets businesses automate their WhatsApp customer support using AI. It handles incoming messages, answers product questions from your knowledge base, escalates to a human when needed, and lets your team monitor and reply from a live dashboard.

Built with **FastAPI**, **LangGraph**, **MongoDB Atlas**, **ChromaDB**, and the **Meta WhatsApp Cloud API**.

---

## Features

- 🧠 **AI Agent** — LangGraph-powered pipeline using Groq Llama 3.3 70B for reasoning and tool calling
- 📚 **RAG Knowledge Base** — Upload PDFs and knowledge docs; the agent answers from them automatically
- 🖼️ **Multimodal** — Handles inbound images (described via Gemini Vision), sends product images and documents
- 📊 **Live Dashboard** — Monitor conversations, reply as a human agent, escalate and resolve chats
- 📡 **Broadcast** — Send messages to multiple customers at once
- 🏢 **Multi-tenant** — Run multiple businesses from one deployment, each with their own persona and knowledge base
- ⚡ **Fast webhook** — Returns 200 OK in <1s, processes the agent in the background

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python) |
| Agent | LangGraph |
| Primary LLM | Groq — Llama 3.3 70B |
| Vision LLM | Google Gemini 2.0 Flash *(optional)* |
| Database | MongoDB Atlas |
| Vector Store | ChromaDB (RAG) |
| File Storage | MongoDB GridFS |
| Messaging | Meta WhatsApp Cloud API |
| Frontend | React + Vite + Tailwind CSS |

---

## Architecture

```
Customer (WhatsApp)
      │
Meta Cloud API ──POST──► FastAPI ──200 OK in <1s──► Meta
                              │
                              └─► Background Task
                                        │
                            ┌───────────▼───────────┐
                            │    LangGraph Agent     │
                            │  1. Acknowledge        │  ← read receipt + typing indicator
                            │  2. Retrieve Context   │  ← RAG + last messages + vision
                            │  3. LLM Reasoning      │  ← Groq + tools
                            │  4. Dispatch Reply     │  ← send + log + update status
                            └───────────────────────┘
                                        │
                                  MongoDB Atlas
                                  ChromaDB (RAG)
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Meta Developer account with a WhatsApp Business App
- Groq API key ([console.groq.com](https://console.groq.com))

### Backend

```bash
cd backend
conda create -n whatsagent python=3.11   # or python -m venv venv
conda activate whatsagent
pip install -r requirements.txt

cp .env.example .env
# Fill in your values in .env

uvicorn app.main:app --reload
```

API docs available at: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
npm run dev
```

Dashboard available at: http://localhost:5173

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGO_DB_NAME=whatsapp_agent

# Meta WhatsApp Cloud API
META_PHONE_NUMBER_ID=your_phone_number_id
META_ACCESS_TOKEN=your_access_token
META_VERIFY_TOKEN=any_string_you_choose
META_APP_SECRET=your_app_secret

# Groq (required)
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile

# Gemini (optional — only for image/vision features)
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.0-flash

# App URL
APP_BASE_URL=http://localhost:8000
```

---

## Connecting WhatsApp

1. Go to [developers.facebook.com](https://developers.facebook.com) and create a WhatsApp Business App
2. Get your **Phone Number ID** and **Access Token** from the API Setup page
3. Set the webhook URL to: `https://<your-backend>/api/webhooks/whatsapp`
4. Set the **Verify Token** to whatever you put in `META_VERIFY_TOKEN`
5. Subscribe to the **messages** field

For local development, use [ngrok](https://ngrok.com) to expose your backend:
```bash
ngrok http 8000
```

---

## Deployment

### Backend → Railway
1. Push to GitHub → Railway → New Project → Deploy from repo
2. Set root directory to `backend`, enable Docker build
3. Add all environment variables
4. Set healthcheck path to `/health`

### Frontend → Vercel
1. Vercel → New Project → Import repo
2. Set root directory to `frontend`, framework: Vite
3. Add env var: `VITE_API_BASE_URL=https://<your-railway-app>.up.railway.app`
4. Deploy

---

## Database Collections

| Collection | Purpose |
|---|---|
| `tenants` | Business profiles, personas, phone number IDs |
| `chat_sessions` | Conversation state per customer per tenant |
| `message_audit_log` | Full message history (inbound + outbound) |
| `knowledge_docs` | RAG source documents per tenant |
| `catalog_items` | Product catalog with images and descriptions |
| `customer_routing` | Maps customer phone → tenant |
| `processed_webhooks` | Idempotency store for webhook deduplication |

---

## Conversation Statuses

| Status | Meaning |
|---|---|
| `WAITING_FOR_BOT` | Bot is active and will auto-reply |
| `AGENT_RESPONDING` | Bot is currently generating a reply |
| `NEEDS_HUMAN` | Escalated — bot is paused, human should respond |
| `RESOLVED` | Conversation closed |

---

## License

MIT
