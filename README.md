# LAC Chatbot - Language-Agnostic Campus Chatbot

A multilingual campus query assistant supporting 10 Indian languages.

Built for ICCET 2026 | Presidency University, Bengaluru

## Team
- Sanath M - Project Lead, RAG Pipeline
- Niha Naaz - Backend Developer (FastAPI + PostgreSQL)
- Rajashree S - Frontend Developer (Next.js)
- Guide: Ms. Subhashini R

## Tech Stack
- Frontend: Next.js 14, Tailwind CSS
- Backend: FastAPI (Python), SQLAlchemy
- Database: PostgreSQL
- Auth: JWT (OAuth2)
- Languages: 10 Indian languages with native script detection

## Setup Instructions

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

### Frontend
cd frontend
npm install
npm run dev

## Environment Variables
Create .env in backend with:
DATABASE_URL=postgresql://user:password@localhost/dbname
JWT_SECRET=your_secret

Create .env.local in frontend with:
NEXT_PUBLIC_API_URL=http://localhost:8000
