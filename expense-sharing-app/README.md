# Expense Sharing App

A full-stack expense sharing application built with Next.js, TypeScript, and Supabase. Split expenses with friends, roommates, and groups. Track balances and settle up easily.

## 🚀 Features

- **User Authentication**: Sign up, sign in, and secure session management
- **Group Management**: Create and manage expense groups
- **Flexible Expense Splitting**: 
  - Equal splits
  - Exact amount splits
  - Percentage-based splits
- **Smart Balance Calculation**: Automatic calculation of who owes whom
- **Debt Simplification**: Minimizes number of transactions needed to settle
- **Real-time Updates**: Changes reflect immediately across the app
- **Secure**: Row Level Security (RLS) policies protect user data

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Supabase** - PostgreSQL database with built-in authentication
- **Vercel** - Hosting and deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   The `.env.local` file is already configured with your Supabase credentials.

3. **Set up Supabase database**
   
   The database schema in `supabase-schema.sql` has been applied to your Supabase project.

4. **Run the development server**

```bash
npm run dev
```

5. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Testing Guide](TESTING.md)** - Manual testing procedures
- **[Deployment Guide](DEPLOYMENT.md)** - Deployment instructions

## 🏗️ Project Structure

```
app/
├── api/              # API route handlers
├── auth/             # Auth pages (login, register)
├── dashboard/        # Dashboard page
└── groups/           # Group and expense pages

components/           # Reusable components
lib/                  # Utilities and logic
types/                # TypeScript types
```

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy with Vercel:
```bash
vercel
```

## 📝 License

MIT License

