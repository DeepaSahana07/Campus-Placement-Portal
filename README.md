# Campus Placement Management System (MERN Stack)

## Project Structure
```
├── backend/          # Express.js + MongoDB API
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routes (controllers inline)
│   ├── middleware/    # JWT auth middleware
│   └── uploads/      # Resume file storage
├── frontend/         # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       └── lib/
```

## Setup

### Backend
```bash
cd backend
cp .env.example .env   # Edit with your MongoDB URI and JWT secret
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Assets
Copy `bg.jpg` and `college-logo.png` into `frontend/src/assets/`.

### MongoDB Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user and whitelist your IP
3. Copy the connection string into `backend/.env`

## Features
- Student & Admin (TPO) authentication with JWT + bcrypt
- Placement drive management with eligibility engine
- Application tracking with status management
- Interview experience sharing with moderation
- Analytics dashboard with Recharts
- Responsive glassmorphism UI
