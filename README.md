# Linkhub

A modern community forum built with React and Supabase. Users can create posts, vote, comment, and discover content through search and sorting.

**Live Demo:** *(deploy link here)*

## Features

- **Authentication** — Secure email/password sign-up and login via Supabase Auth
- **Post Feed** — Create, read, search, and sort posts; Markdown content with live preview
- **Voting** — Upvote/downvote system with optimistic UI updates
- **Comments** — Threaded comments on each post stored in Supabase
- **Edit & Delete** — Post owners can edit or remove their own posts
- **Profile Dashboard** — User stats (post count, total upvotes, comments), post history
- **Image Support** — Attach images to posts via URL

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v7           |
| Backend    | Supabase (PostgreSQL + Auth)        |
| Markdown   | react-markdown                      |
| Build      | Vite 6                              |
| Deployment | Vercel                              |

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

```bash
git clone https://github.com/ichowdhury10/Codepath-Final-Project.git
cd Codepath-Final-Project
npm install
```

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Table

Create a `posts` table in your Supabase project:

```sql
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  title text not null,
  content text not null,
  image_url text,
  upvotes integer default 0,
  downvotes integer default 0,
  comments text[] default '{}',
  owner uuid references auth.users(id),
  tags text[]
);

-- Enable Row Level Security
alter table posts enable row level security;

-- Allow authenticated users to read all posts
create policy "Public read" on posts for select using (true);

-- Allow users to insert their own posts
create policy "Authenticated insert" on posts for insert with check (auth.uid() = owner);

-- Allow users to update/delete their own posts
create policy "Owner update" on posts for update using (auth.uid() = owner);
create policy "Owner delete" on posts for delete using (auth.uid() = owner);
```

### Run

```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── PostFeed.jsx      # Main feed with create, search, sort, vote
│   ├── PostPage.jsx      # Full post view with edit, delete, comments
│   ├── Profile.jsx       # User stats and post history
│   ├── Login.jsx         # Login form
│   └── SignUp.jsx        # Registration form
├── contexts/
│   └── AuthContext.jsx   # Supabase auth state & helpers
├── supabaseClient.js     # Supabase client initialization
└── App.jsx               # Router, header, protected routes
```
