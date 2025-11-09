# T-Mobile Sentiment Dashboard (frontend)

Minimal React + Vite + TypeScript app with TailwindCSS and Recharts.

Quick start:

1. npm install
2. npm run dev

This project currently uses a local mock data generator in `src/hooks/useSentimentData.ts` which emits a random sentiment score every 2 seconds. Replace the hook implementation to connect to a backend or WebSocket.

Env:
- `.env` contains `VITE_API_URL` placeholder for future backend URL.
