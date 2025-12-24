# Add Member to Group - Setup Instructions

## ✅ Feature Summary

I've added the functionality to **add members to an existing group** after it's created. This feature includes:

### What's Been Added:

1. **UI Component**: New page at `/groups/[id]/members/add` where admins can add members
2. **API Enhancement**: Updated `/api/groups/[id]/members` to support email-based user lookup
3. **User Search API**: New endpoint `/api/users/search?email=xxx` to find users by email
4. **Button**: "Add Member" button added to group detail page

### How It Works:

- **Only admins** can add members to a group (enforced in API)
- Members can be added by either:
  - User ID (UUID)
  - Email address (the user must have an account)
- New members can be assigned as either "Member" or "Admin" role

---

## 🔧 Required: Execute SQL in Supabase

To enable email-based member addition, you need to create a **profiles table** in Supabase that stores public user information.

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the SQL Script

Copy and paste the entire contents of `create-profiles-table.sql` into the SQL editor and click **RUN**.

This script will:
- ✅ Create a `profiles` table with user email and name
- ✅ Set up Row Level Security (RLS) policies
- ✅ Create a trigger to automatically populate profiles when users sign up
- ✅ Backfill profiles for all existing users

### Step 3: Verify

After running the script, verify it worked:

```sql
-- Check if profiles table exists
SELECT * FROM profiles LIMIT 5;

-- Check if your user has a profile
SELECT * FROM profiles WHERE email = 'your-email@example.com';
```

You should see your user's profile with their email and name.

---

## 📋 How to Use the Feature

### As a Group Admin:

1. **Navigate to a group** you admin
2. **Click "Add Member"** button (green outline button next to "Add Expense")
3. **Enter either**:
   - The user's email address (they must have an account), OR
   - The user's UUID (User ID)
4. **Select role**: Member or Admin
5. **Click "Add Member"**

The user will immediately be added to the group and can:
- View group expenses
- Add new expenses
- See balances
- (If admin) Add more members and edit group

---

## 🗂️ Files Created/Modified

### New Files:
- `app/groups/[id]/members/add/page.tsx` - UI for adding members
- `app/api/users/search/route.ts` - API to search users by email
- `create-profiles-table.sql` - SQL script to create profiles table

### Modified Files:
- `app/api/groups/[id]/members/route.ts` - Updated to support email lookup
- `app/groups/[id]/page.tsx` - Added "Add Member" button

---

## ⚠️ Important Notes

### Current Limitations:
- Users must have an account (registered) before they can be added
- Email lookup requires the profiles table to be created in Supabase
- Only group admins can add members (enforced via RLS policies)

### Security:
- ✅ RLS policies ensure only group admins can add members
- ✅ Duplicate member checks prevent adding same user twice
- ✅ Email validation prevents invalid emails
- ✅ Profiles table has RLS enabled for security

---

## 🧪 Testing

### Test the Feature:

1. **Create a test user** (register a second account)
2. **Create a group** with your main account
3. **Click "Add Member"** on the group page
4. **Add the test user** by their email
5. **Log in as the test user** and verify they can see the group

### Expected Behavior:
- ✅ Admin can add members by email or user ID
- ✅ Added member appears in group members list immediately
- ✅ Added member can access the group
- ✅ Non-admins cannot access the "Add Member" page
- ✅ Duplicate members are rejected with error message

---

## 🚀 What's Next?

After running the SQL script, the feature is fully functional! Additional enhancements you could add:

1. **Email invitations** - Send email invites to non-registered users
2. **Member removal UI** - Add a UI to remove members (API already exists)
3. **User search autocomplete** - Auto-complete email addresses as user types
4. **Profile pages** - Show user profiles with their name and email
5. **Member permissions** - More granular permissions beyond admin/member

---

## 📞 Support

If you encounter any issues:

1. **Check Supabase logs** - SQL Editor > Logs
2. **Verify profiles table** - Run `SELECT * FROM profiles;`
3. **Check RLS policies** - Database > Tables > profiles > Policies
4. **Test API endpoint** - Use browser dev tools to check network requests

The profiles table is essential for email-based member lookup to work properly!
