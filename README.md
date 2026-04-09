# WebCraft 🚀

WebCraft is a full-stack web application designed to help users create and manage web projects. It leverages a modern MERN-like stack utilizing PostgreSQL, Express, React, Node.js, and Prisma ORM.

## Project Architecture

This repository is split into two primary folders:

- `/client`: The frontend application built with React, Vite, and Tailwind CSS.
- `/server`: The backend API built with Express, Node.js, Prisma (PostgreSQL), and Better-Auth.

## Local Development Setup

To run this project locally, follow these steps:

### 1. Database Setup
Ensure you have PostgreSQL installed and running locally, or use a hosted PostgreSQL service (like Supabase or Neon).

### 2. Backend (Server) Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Copy the environment variables template: `cp .env.example .env`
4. Fill out the `.env` file with your database connection URL, your AI API key, and a randomly generated auth secret.
5. Push the schema to your database: `npx prisma db push`
6. Start the development server: `npm start` (Runs on port 3000 by default)

### 3. Frontend (Client) Setup
1. Open a new terminal and navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Copy the environment variables template: `cp .env.example .env`
4. Start the frontend: `npm run dev` (Runs on port 5173 by default)

---

## Deployment Guide

We recommend a split deployment strategy: hosting the **Client** on **Vercel** and the **Server** on **Railway**.

### 1. Deploying the Backend on Railway
1. Push this repository to GitHub.
2. Log into Railway and create a new project from your GitHub Repository.
3. Select the `/server` folder as the root directory for this service, OR set the "Root Directory" to `/server` in Railway settings.
4. **Environment Variables Config:** Add all variables from `server/.env.example` to your Railway project environment settings. 
   - *Important:* Ensure `TRUSTED_ORIGIN` is set to your future Vercel frontend URL.
5. **Start Command:** Ensure Railway uses `npm run start` or `node server.js` depending on how compilation is set up.

### 2. Deploying the Frontend on Vercel
1. Log into Vercel and Import your GitHub Repository.
2. Select the `client` directory as the Root Directory.
3. Framework settings (Vite) should be automatically detected.
4. **Environment Variables Config:** Add `VITE_BASEURL` and set it to your deployed Railway backend URL (e.g., `https://webcraft-server.up.railway.app`).
5. Click **Deploy**.

## License
MIT License
