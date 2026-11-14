# Doctor Tracker | Full-Stack Healthcare Management Portal

## Requirement

A secure, scalable full-stack web application designed for healthcare administration, enabling guests to browse doctors alphabetically with advanced filtering, and providing authenticated administrators with complete CRUD capabilities, pagination, visual dashboard analytics, and secure role-based management.

---

## Description

Doctor Tracker is a modern full-stack web application built with a Node.js/Express backend, Next.js frontend, and MongoDB Atlas database. It bridges the gap between patients and medical professionals by offering an intuitive public alphabetical guest directory alongside a heavily secured, token-protected administrative portal. Admins can seamlessly manage doctor profiles, track patient assignments, monitor live hospital metrics via interactive charts, and register new administrative personnel. Containerized with Docker Compose, the application guarantees consistent, friction-free deployment across local development and production cloud environments like Render and Vercel.

---

## Setup Guide

### Prerequisites

- [Docker & Docker Compose](https://www.docker.com/) installed on your machine.
- Alternatively: Node.js (v18+) and a MongoDB Atlas cluster URI.

### Environment Variables (`.env.example`)

Create a `.env` file in your root/backend directory matching this structure:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:3000

```

Step-by-Step Local Installation (via Docker Compose)

## 1. Clone the Repository:

git clone [https://github.com/yourusername/doctor-tracker.git](https://github.com/yourusername/doctor-tracker.git)

cd doctor-tracker

## 2. Configure Environment Variables:

Create and populate your .env file based on the .env.example template above.

## 3. Run with Docker Compose:

docker-compose up --build

## 4. Access the Application:

Frontend (Guest Directory & Admin Portal): http://localhost:3000

Backend API: http://localhost:5000/api

## System Architecture:

The application follows a decoupled client-server architecture containerized for reliability:

Frontend Client (Next.js): Runs on port 3000, handling server-side rendering, client-side state, protected route guards, and Chart.js analytics visualizations.

Backend API Server (Node.js & Express): Runs on port 5000, handling RESTful endpoints, JWT authentication middleware, password hashing (bcryptjs), and database pagination logic (.skip() and .limit()).

Database Layer (MongoDB Atlas): A fully managed cloud NoSQL database storing decoupled Admin, Doctor, and Patient collections with relational references.

## Technical Decisions

## 1. I have used Docker instead of installing Node.js, Express.js, Next.js, and MongoDB inside my machine. Why?

Using Docker guarantees environment parity and eliminates the "it works on my machine" problem. By containerizing the frontend and backend services, all runtime dependencies, OS-level packages, and Node versions are encapsulated within isolated containers. This allows any developer or evaluator to spin up the entire multi-service stack with a single docker-compose up command without cluttering their local host machine or dealing with version conflicts.

## 2. I have used MongoDB Atlas instead of using MongoDB in my Docker container. Why?

Using MongoDB Atlas (a fully managed cloud database) offers high availability, automated backups, built-in security, and seamless production readiness without the overhead of managing a database container volume. Furthermore, when deploying the backend API to cloud platforms like Render or Vercel, having a cloud-hosted database ensures that data persists permanently across container restarts and redeployments, whereas a containerized local database would risk data loss when instances spin down.
