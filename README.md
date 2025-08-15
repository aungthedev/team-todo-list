📝 To-Do List App

A collaborative To-Do List web app built using JavaScript, React.js, Next.js, and Supabase for backend storage and API handling.
It allows users to add, edit, delete, and mark tasks as completed, with persistent storage through Supabase.


🚀 What It Does

Add, edit, and delete tasks.
Mark tasks and shows line through as completed .
Store tasks persistently using Supabase backend.
Simple, clean UI design.
Real-time updates synced with the backend.

🛠 Tech Stack

Frontend:
JavaScript
React.js
Next.js
Tailwind CSS

Backend:
Supabase (PostgreSQL + Authentication + API)
Version Control:
Git & GitHub (branch workflow for collaboration)


▶How to Run

CLone the Repo first by 
git clone <repo-link>
cd <repo-folder>

Before running the project, please do these,

Create new file ".env.local" in the root folder and paste these inside that file,
NEXT_PUBLIC_SUPABASE_URL=https://czdjibmszzssmdecvfxg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZGppYm1zenpzc21kZWN2ZnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTU5NzYsImV4cCI6MjA3MDU3MTk3Nn0.hwaAxSEcXZHZmWN2rLfThb4NfBr-hP4Kd40dDJReZac

-npm install 
-npm run dev

Then, Open http://localhost:3000 in your browser



👨‍💻Who Did What

Jayden – Frontend development (raw frontend version using local state, before backend integration).

Orion Lynn – Backend development (connected frontend to Supabase backend).

Asett – UI design,and testing (verified backend and frontend integration).

David Lin – Frontend development (contributed to UI features and frontend functionality and testing).

Collaboration:
All four of us contributed to testing, debugging, and managing branches/updates via GitHub.

![App Screenshot](./public/Screenshot%202025-08-15%20094050.png)