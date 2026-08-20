# Mispha Ministries Web Platform

Modern, responsive web platform for Mispha Ministries built with React, Vite, Express, and Prisma.

## Architecture

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express (TypeScript)
- **Database**: PostgreSQL (via Prisma ORM)
- **Storage**: Supabase Storage (for images)
- **Deployment**: Vercel (Frontend) + Render.com (Backend)

## Development Setup

### 1. Prerequisites
- Node.js (v20+)
- npm
- Supabase account (for PostgreSQL and Storage)

### 2. Environment Variables
Copy the example environment files and fill in your details:
```bash
cp .env.example .env
cp server/.env.example server/.env
```
Ensure you set up your Supabase project and get the `DATABASE_URL` and `SUPABASE_*` keys.

### 3. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 4. Database Setup
Ensure your `DATABASE_URL` in `server/.env` is correct, then run:
```bash
cd server
npx prisma db push
npm run db:seed
```

### 5. Run Locally
From the root directory, start both frontend and backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3002`

## Deployment

### Frontend (Vercel)
1. Import the GitHub repository into Vercel.
2. Set the Framework Preset to **Vite**.
3. In Environment Variables, set `VITE_API_URL` to your production backend URL (e.g., `https://mispha-api.onrender.com`).
4. Deploy.

### Backend (Render.com)
1. Create a new **Web Service** on Render and connect the repository.
2. The `render.yaml` file in `server/` will automatically configure the service.
3. Go to the service settings in Render and add the environment variables from `server/.env.example` (especially `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
4. Set `ALLOWED_ORIGINS` to your Vercel URL (e.g., `https://misphaministries.com,https://www.misphaministries.com`).
5. Deploy.

## Admin Panel
Access the admin panel at `/admin` (e.g., `http://localhost:5173/admin`). Use the credentials set in `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
