**Linkhub**

Linkhub is a modern React-powered community forum application built to showcase my full-stack web development skills. Users can sign up, create and manage posts with rich text (Markdown) and optional images, interact through upvotes/downvotes and comments, and personalize their experience with live previews and real-time updates via Supabase.

**Live Demo**



Tech Stack & Tools

Frontend: ReactJs, React Router, React Markdown

Styling: CSS Modules (component-scoped .css files), Flexbox, Grid

Backend & Database: Supabase (PostgreSQL, Auth, Storage)

Real-time: Supabase Realtime Postgres Changes

Authentication: Supabase Auth (Email/Password)

Hosting: Vercel or Netlify (for frontend), Supabase Edge Functions (for serverless tagging endpoint)

Utilities: OpenAI API (GPT-3.5 for AI-generated tags), ESLint, Prettier

Version Control: Git, GitHub

**Key Features**

User Authentication – Secure email/password sign up & login powered by Supabase Auth.

Create & Manage Posts – Write titles, Markdown-enabled content, and optional image URLs; live preview before submitting.

Real-time Feed – View, sort (newest/upvotes/downvotes), and search posts without page reloads.

Post Interactions – Upvote/downvote any number of times; leave threaded comments on each post.

Post Detail Page – Full view of content, images, AI-generated tags, and comment threads with edit/delete by author.

Realtime Updates – Supabase Realtime listens for inserts, updates, and deletes to instantly refresh the feed.

AI Integration – OpenAI GPT-3.5 Turbo suggests relevant single-word tags for each post.

Profile Dashboard – View account details, personal info (name, age, location), and summary of your posts.
