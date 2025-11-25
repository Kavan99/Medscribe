# Environment Setup Guide

## Supabase Configuration

To run this application, you need to set up Supabase environment variables. Follow these steps:

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be set up

### 2. Get Your Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Project URL** and **anon/public key**

### 3. Create Environment File
Create a `.env.local` file in the root of this project with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholder values with your actual Supabase credentials.

### 4. Example
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0NzIwMCwiZXhwIjoxOTUyMTIzMjAwfQ.example
```

### 5. Restart Your Development Server
After creating the `.env.local` file, restart your Next.js development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

## Important Notes
- The `.env.local` file should be added to your `.gitignore` to keep your credentials secure
- Never commit your actual Supabase credentials to version control
- The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js
