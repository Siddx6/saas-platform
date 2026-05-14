# SaaSPlatform — Multi-Tenant Business Analytics SaaS

A production-grade multi-tenant SaaS platform where businesses can sign up, manage their teams, upload revenue data, and receive AI-generated weekly business reports.

🔗 **Live Demo:** [https://saas-platform-gold.vercel.app](https://saas-platform-gold.vercel.app)

---

## Features

- **Multi-tenant architecture** — each company gets a fully isolated workspace
- **Authentication** — email/password + Google OAuth, JWT with refresh tokens
- **Role-based access control** — Owner, Admin, Member roles with route guards
- **Revenue dashboard** — real-time KPI cards, line chart, bar chart, CSV upload
- **AI weekly reports** — Groq LLaMA 3 generates business insights from your data every Monday
- **Team management** — invite members via email, change roles, remove members
- **Subscription billing** — Razorpay integration with Free and Pro plans (₹999/month)
- **Email notifications** — signup verification, team invites, weekly report delivery
- **Mobile responsive** — works on all screen sizes with slide-out sidebar

---

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS v3
- Zustand (state management with persistence)
- TanStack Query (server state + caching)
- Recharts (data visualization)
- React Router DOM v6

### Backend (Node.js)
- Express.js
- MongoDB + Mongoose
- JWT authentication + refresh tokens
- Passport.js (Google OAuth 2.0)
- Nodemailer (email delivery via Gmail SMTP)
- Razorpay (subscription billing)
- node-cron (scheduled weekly report jobs)
- Helmet + CORS + Rate limiting

### AI Microservice (Python)
- FastAPI
- Pandas (data analysis — growth, best/worst day, anomalies)
- Groq LLaMA 3 8B (AI report generation)
- APScheduler (cron jobs)
- Pydantic (request/response validation)

### DevOps & Infrastructure
- Vercel (frontend hosting)
- Render (Node.js backend + Python AI service)
- MongoDB Atlas (cloud database)
- GitHub (version control + CI/CD via auto-deploy)

---

## Architecture

```
┌──────────────────────┐     ┌───────────────────────┐     ┌──────────────────────┐
│   React Frontend      │────▶│   Node.js Backend      │────▶│  Python AI Service   │
│   Vercel              │     │   Render               │     │  Render              │
│   port 5173 (local)   │     │   port 5000 (local)    │     │  port 8000 (local)   │
└──────────────────────┘     └───────────────────────┘     └──────────────────────┘
                                          │
                               ┌──────────▼──────────┐
                               │    MongoDB Atlas      │
                               │    cloud database     │
                               └─────────────────────┘
```

---

## Project Structure

```
saas-platform/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # Route pages
│   │   ├── components/      # Reusable UI components
│   │   ├── store/           # Zustand state
│   │   ├── api/             # Axios API calls
│   │   └── utils/           # Helper functions
├── server/                  # Node.js backend
│   └── src/
│       ├── controllers/     # Business logic
│       ├── routes/          # Express routes
│       ├── models/          # Mongoose schemas
│       ├── middleware/       # Auth, role, plan guards
│       ├── services/        # Email, AI, Razorpay
│       └── jobs/            # Cron jobs
├── ai-service/              # Python FastAPI microservice
│   ├── routers/             # API endpoints
│   ├── services/            # Analyzer + LLM
│   └── models/              # Pydantic schemas
└── docker-compose.yml       # Local multi-service setup
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/Siddx6/saas-platform.git
cd saas-platform
```

### 2. Backend setup
```bash
cd server
npm install
# Create .env file with the variables listed below
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
# Create .env with VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 4. Python AI service setup
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
# Create .env with GROQ_API_KEY and SERVICE_SECRET
uvicorn main:app --reload --port 8000
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user + workspace |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Logout + invalidate refresh token |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/me` | Get current user |

### Workspace
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspace` | Get workspace details |
| PATCH | `/api/workspace` | Update workspace name |
| GET | `/api/workspace/members` | List all members |
| POST | `/api/workspace/invite` | Send invite email |
| POST | `/api/workspace/accept-invite/:token` | Accept invite |
| PATCH | `/api/workspace/members/:id/role` | Change member role |
| DELETE | `/api/workspace/members/:id` | Remove member |

### Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/data/upload` | Upload CSV data |
| GET | `/api/data/summary` | Get KPI summary + activity |
| GET | `/api/data/revenue-chart?range=daily` | Get chart data |
| GET | `/api/data/top-products` | Get top 5 products |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | List all reports |
| GET | `/api/reports/:id` | Get single report |

### Billing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/billing/create-order` | Create Razorpay order |
| POST | `/api/billing/verify-payment` | Verify payment signature |

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://saas-platform-gold.vercel.app |
| Backend | Render | https://saas-platform-server.onrender.com |
| AI Service | Render | https://saas-platform-ai.onrender.com |
| Database | MongoDB Atlas | cloud hosted |

---

## Author

**Siddharth Kumar**
- Email: siddharthkumar2344@gmail.com