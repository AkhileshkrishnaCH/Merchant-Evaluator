# AI Merchant Health Dashboard

An AI-powered merchant health evaluation dashboard with deterministic scoring and LLM-powered insights.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Recharts
- **Backend**: FastAPI + Python + Pydantic + SQLAlchemy
- **LLM**: Google Gemini (with deterministic fallback)

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env   # Add your GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- 12-metric health scoring engine
- 5 risk classification levels
- AI-powered executive summaries and recommendations
- Interactive merchant simulator
- Dark/Light mode toggle
- Responsive design
