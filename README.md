# DiversifyAI (PortfolioPilot)

DiversifyAI is a full-stack portfolio intelligence platform for Indian investors.
It combines portfolio tracking, AI-based analysis, and advisor consultations with payment-gated chat sessions.

## What This Project Delivers

- Secure authentication with role-based access (`client`, `advisor`, `admin`)
- Portfolio management with live/periodic price updates
- Sector allocation analytics
- AI portfolio analysis with daily caching
- Advisor discovery and admin-controlled advisor onboarding
- Razorpay payment verification for consultation unlocks
- Consultation chat with 24-hour access windows
- Auto-shared portfolio snapshot at consultation start (structured chat payload)

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Yahoo Finance API (`yahoo-finance2`)
- Razorpay
- OpenAI-compatible client against MegaLLM endpoint

## Repository Structure

- `backend/`: Express API, models, middleware, integrations, cron job
- `frontend/`: React app, pages, components, API clients
- `api_infra.doc`: Full API documentation based on current implementation
- `project.txt`: Product/problem context and planning notes

## Roles and Access Model

### Client
- Register/login
- Manage portfolio
- Run AI analysis
- Pay for advisor consultation
- Chat during active session window
- View consultation history

### Advisor
- Login
- View advisor inbox (`/api/chat/advisor/rooms`)
- Participate in client chats
- View earnings dashboard (`/api/payment/advisor/earnings`)

### Admin
- Login using env-defined credentials
- Create advisor accounts via admin-only API

## Core Product Flows

### 1) Authentication and Session
1. User registers via `/api/auth/register` (always role `client`).
2. User/advisor/admin logs in via `/api/auth/login`.
3. JWT token is used in `Authorization: Bearer <token>` for protected APIs.

### 2) Portfolio Lifecycle
1. Client adds holdings via `/api/portfolio/add`.
2. Portfolio read via `/api/portfolio` returns holdings + summary + `pricesLastUpdatedAt`.
3. Sector chart data fetched from `/api/portfolio/sectors`.
4. Optional stock discovery via `/api/portfolio/search?q=...`.

### 3) AI Analysis Lifecycle
1. Client requests analysis via `POST /api/analysis/portfolio`.
2. If same-day snapshot exists, cached result is returned.
3. Else backend calls LLM and stores daily snapshot.
4. Dashboard/non-triggered views can use `GET /api/analysis/latest` to avoid LLM calls.

### 4) Consultation and Chat Lifecycle
1. Client creates payment order via `/api/payment/create-order`.
2. Client verifies payment via `/api/payment/verify`.
3. Backend unlocks 24-hour consultation session and initializes/updates chat room.
4. Backend auto-sends portfolio snapshot message (`messageType: portfolio_snapshot`) in chat.
5. Client and advisor chat via `/api/chat/send` and `/api/chat/messages/:chatId`.
6. Client send access expires after session window unless repaid.

## API Surface (Quick Index)

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/advisors`
- `POST /api/auth/admin/create-advisor` (admin only)

### Portfolio
- `GET /api/portfolio/search?q=<query>`
- `GET /api/portfolio`
- `POST /api/portfolio/add`
- `DELETE /api/portfolio/remove/:symbol`
- `GET /api/portfolio/sectors`

### Analysis
- `POST /api/analysis/portfolio`
- `GET /api/analysis/latest`

### Payment
- `POST /api/payment/create-order`
- `POST /api/payment/verify`
- `GET /api/payment/advisor/earnings` (advisor only)

### Chat
- `POST /api/chat/create-room`
- `POST /api/chat/send`
- `GET /api/chat/messages/:chatId`
- `GET /api/chat/advisor/rooms` (advisor only)
- `GET /api/chat/client/rooms` (client only)

See `api_infra.doc` for detailed request/response samples and behavior notes.

## Environment Configuration

Create backend env file from `backend/example.env`.

Required variables:

- `PORT`
- `FRONTEND_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `MEGALLM_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Frontend env variable:

- `VITE_API_BASE_URL` (default fallback is `http://localhost:5000/api`)

## Local Development

### Backend
1. `cd backend`
2. `npm install`
3. Configure `.env`
4. `npm run dev` (or `npm start`)

### Frontend
1. `cd frontend`
2. `npm install`
3. Set `VITE_API_BASE_URL` if backend is not on default
4. `npm run dev`

## Operational Notes

- Price update strategy:
  - Portfolio endpoint refreshes prices once per 24h unless forced (`forceRefresh=true`).
  - Nightly cron also updates portfolio prices.
- AI cost-control strategy:
  - Snapshot caching is daily per user.
- Consultation access strategy:
  - Payment verification sets `paidAt` and `accessExpiresAt`.
  - Chat authorization checks active session records.

## Data Model Highlights

- `User`: role-aware identity (`client`, `advisor`, `admin`)
- `Portfolio`: one per user, with stock holdings and `pricesLastUpdatedAt`
- `Payment`: Razorpay linkage, status, paid timestamp, access expiry
- `ChatRoom`: unique client-advisor room with session timestamps
- `Message`: supports typed payload (`text`, `portfolio_snapshot`)
- `AnalysisSnapshot`: one per user per UTC day

## Security and Validation Highlights

- JWT verification for protected routes
- Role-based middleware for sensitive actions
- Admin identity reserved via env credentials
- Razorpay signature verification before consultation unlock
- Participant checks for chat access

## Suggested Next Enhancements

- Add OpenAPI/Swagger generation for API contract tooling
- Add automated tests for payment->chat unlock and role policies
- Add rate limiting and request audit logs for production hardening
- Add CI pipeline for lint/build/test checks
