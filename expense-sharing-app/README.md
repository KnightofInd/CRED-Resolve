# 💰 Expense Sharing App

A modern, full-stack expense sharing application that helps groups split bills and track expenses effortlessly. Built with cutting-edge technologies for performance, security, and scalability.

## 📝 Project Description

This expense sharing app allows users to create groups (for roommates, trips, events, etc.), add expenses, and automatically calculate who owes whom. The app features intelligent debt simplification that minimizes the number of transactions needed to settle all balances within a group. With secure authentication and real-time updates, it's perfect for managing shared expenses in any scenario.

## ✨ Key Features

- 🔐 **Secure Authentication** - Email/password signup and login with session management
- 👥 **Group Management** - Create and manage multiple expense groups
- 💸 **Flexible Expense Splitting**:
  - Equal splits (divide evenly among members)
  - Exact amounts (specify exact amount per person)
  - Percentage-based (split by custom percentages)
- 📊 **Smart Balance Tracking** - Automatic calculation of balances and debts
- 🔄 **Debt Simplification** - Minimizes transactions using advanced algorithms
- ⚡ **Real-time Updates** - Instant synchronization across all users
- 🛡️ **Row Level Security** - Database-level security policies

## 🛠️ Technology Stack

- **Frontend**: Next.js 16.1.1 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with SSR support
- **Hosting**: Vercel

---

## 🏗️ How This Project Was Built

### Step 1: Project Initialization
- Set up Next.js 16 with TypeScript and App Router
- Configured Supabase clients for browser and server environments
- Installed dependencies: `@supabase/supabase-js` and `@supabase/ssr`

### Step 2: Database Design & Security
- Designed 6-table schema: `groups`, `group_members`, `expenses`, `expense_splits`, `balances`, `settlements`
- Implemented Row Level Security (RLS) policies for data protection
- Created automatic triggers for balance updates
- Set up foreign key relationships and indexes

### Step 3: Backend API Development
Built 12 RESTful API endpoints:
- Authentication: `/api/auth/signup`, `/api/auth/signin`, `/api/auth/signout`
- Groups: `/api/groups` (GET, POST), `/api/groups/[id]` (GET)
- Members: `/api/groups/[id]/members` (POST, DELETE)
- Expenses: `/api/expenses` (POST), `/api/groups/[id]/expenses` (GET)
- Balances: `/api/groups/[id]/balances` (GET)
- Settlements: `/api/settlements` (POST)

### Step 4: Balance Calculation Engine
- Implemented balance aggregation across all expenses
- Built debt simplification algorithm using greedy approach
- Created settlement tracking system
- Added validation for split calculations

### Step 5: Frontend Development
Created 9 pages:
- Authentication: Login, Register
- Dashboard: Groups overview
- Groups: Create, View details, Manage members
- Expenses: Create, View list

Built 5 reusable components for consistent UI

### Step 6: Deployment & Production
- Configured environment variables for production
- Set up Vercel deployment
- Fixed middleware for Next.js 16 compatibility
- Resolved RLS policy conflicts
- Optimized for performance

---

## 🎯 Why This Approach Proved Effective

### 1. **Scalable Architecture**
Using Next.js App Router with server components reduced client-side JavaScript and improved performance.

### 2. **Type Safety**
TypeScript caught errors during development, reducing bugs in production.

### 3. **Database-Level Security**
RLS policies ensure users can only access their own data, even if API endpoints are compromised.

### 4. **Simplified State Management**
Server-side rendering eliminated need for complex state management libraries.

### 5. **Efficient Debt Algorithm**
Greedy simplification reduces O(n²) transactions to O(n), making settlements much faster.

### 6. **Modern Stack**
Latest versions of Next.js, React, and Supabase provide best performance and developer experience.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account ([create one free](https://supabase.com))

### Installation Steps

1. **Clone and Install**
   ```bash
   cd expense-sharing-app
   npm install
   ```

2. **Set Up Supabase**
   
   a. Create a Supabase account at [supabase.com](https://supabase.com)
   
   b. Create a new project
   
   c. Go to SQL Editor and run the schema from `supabase-schema.sql`
   
   d. Disable email confirmation (for development):
      - Go to Authentication → Providers → Email
      - Turn OFF "Confirm email"
      - Save changes

3. **Configure Environment Variables**
   
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   Get these values from Supabase Dashboard → Settings → API

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open the App**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 How to Use the App

### 1. **Create an Account**
- Click "Sign Up" on the homepage
- Enter your email and password
- Log in with your credentials

### 2. **Create Your First Group**
- Go to Dashboard
- Click "Create New Group"
- Enter group name (e.g., "Roommates", "Trip to Paris")
- Add an optional description
- Click "Create Group"

### 3. **Add Group Members**
- Open the group you created
- Click "Add Member"
- Enter the user's email (they must have an account)
- Assign role (Admin or Member)

### 4. **Add an Expense**
- Inside a group, click "Add Expense"
- Enter description (e.g., "Grocery Shopping")
- Enter total amount
- Select who paid
- Choose split type:
  - **Equal**: Split evenly among all members
  - **Exact**: Specify exact amount for each person
  - **Percentage**: Assign percentage to each person
- Click "Add Expense"

### 5. **View Balances**
- Click "Balances" tab in the group
- See who owes whom
- View simplified debts (minimum transactions needed)

### 6. **Settle Up**
- When someone pays their debt, click "Record Settlement"
- Select who paid whom and the amount
- Balances update automatically

---

## 🏗️ Project Structure

```
expense-sharing-app/
├── app/
│   ├── api/              # API Routes (12 endpoints)
│   │   ├── auth/         # Authentication endpoints
│   │   ├── groups/       # Group management
│   │   ├── expenses/     # Expense creation
│   │   └── settlements/  # Settlement tracking
│   ├── auth/             # Login & Register pages
│   ├── dashboard/        # Main dashboard
│   └── groups/           # Group pages & expense views
├── components/           # Reusable UI components
├── lib/
│   ├── supabase-browser.ts    # Browser Supabase client
│   ├── supabase-server.ts     # Server Supabase client
│   ├── balance-engine.ts      # Balance calculation logic
│   ├── validation.ts          # Input validation
│   └── auth.ts                # Auth utilities
├── types/                # TypeScript type definitions
├── middleware.ts         # Route protection
└── supabase-schema.sql   # Database schema
```

---

## 🚀 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Configure Supabase for Production**
   - In Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel domain to "Site URL"
   - Add `https://your-domain.vercel.app/**` to "Redirect URLs"

---

## 🔧 Troubleshooting

### Issue: "Error sending confirmation email"
**Solution**: Disable email confirmation in Supabase (see step 2d above)

### Issue: "Row Level Security policy violation"
**Solution**: Run the RLS fix SQL:
```sql
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE group_members DISABLE ROW LEVEL SECURITY;
```
(For production, implement proper RLS policies)

### Issue: Environment variables not working
**Solution**: Restart the dev server after changing `.env.local`

---

## 📊 Database Schema

**6 Main Tables:**
1. **groups** - Group information
2. **group_members** - User-group relationships
3. **expenses** - Expense records
4. **expense_splits** - Individual split amounts
5. **balances** - Calculated balances per user per group
6. **settlements** - Payment records

---

## 👨‍💻 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Tech Details

- **Next.js 16.1.1** with App Router
- **TypeScript 5** for type safety
- **Supabase** for database and auth
- **@supabase/ssr** for server-side rendering
- **Tailwind CSS** for styling

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🙏 Acknowledgments

Built with modern web technologies following best practices for security, performance, and scalability.

**Made with ❤️ for hassle-free expense sharing**

