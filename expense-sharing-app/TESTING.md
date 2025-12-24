# Manual Testing Script

## Prerequisites
- Supabase project is set up
- Environment variables are configured
- Development server is running (`npm run dev`)

## Test Scenarios

### 1. Authentication Tests

#### Sign Up
1. Navigate to `/auth/register`
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Enter name: `Test User`
5. Click "Register"
6. **Expected**: Redirected to `/dashboard`

#### Sign In
1. Navigate to `/auth/login`
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click "Sign In"
5. **Expected**: Redirected to `/dashboard`

#### Sign Out
1. From dashboard, click "Sign Out"
2. **Expected**: Redirected to `/auth/login`

### 2. Group Management Tests

#### Create Group
1. Sign in and navigate to `/dashboard`
2. Click "+ Create Group"
3. Enter name: `Weekend Trip`
4. Enter description: `Trip to the mountains`
5. Click "Create Group"
6. **Expected**: Redirected to group detail page

#### View Groups
1. Navigate to `/dashboard`
2. **Expected**: See list of groups with member counts

#### View Group Details
1. Click on a group from dashboard
2. **Expected**: See group name, description, member count

### 3. Expense Management Tests

#### Create Equal Split Expense
1. Navigate to a group detail page
2. Click "+ Add Expense"
3. Enter description: `Dinner`
4. Enter amount: `100.00`
5. Select split type: `Equal`
6. Select all members
7. Click "Create Expense"
8. **Expected**: Expense appears in expenses list

#### Create Exact Split Expense
1. Click "+ Add Expense"
2. Enter description: `Groceries`
3. Enter amount: `50.00`
4. Select split type: `Exact`
5. Select members and enter exact amounts (must total 50.00)
6. Click "Create Expense"
7. **Expected**: Expense created successfully

#### Create Percentage Split Expense
1. Click "+ Add Expense"
2. Enter description: `Gas`
3. Enter amount: `60.00`
4. Select split type: `Percentage`
5. Select members and enter percentages (must total 100)
6. Click "Create Expense"
7. **Expected**: Expense created successfully

#### Delete Expense
1. From group detail page, find an expense
2. Click "Delete" button
3. Confirm deletion
4. **Expected**: Expense removed from list

### 4. Balance Tests

#### View Balances
1. Navigate to group detail page
2. Look at "Balances" section on the right
3. **Expected**: See total expenses amount and simplified debts

#### Check Zero Balance
1. Create expenses where splits balance out
2. **Expected**: See "All settled up!" message

#### Check Non-Zero Balance
1. Create unbalanced expenses
2. **Expected**: See suggested payments with amounts

### 5. Edge Cases Tests

#### Invalid Expense Amount
1. Try to create expense with amount: `0` or `-10`
2. **Expected**: Validation error

#### Invalid Split Total (Exact)
1. Create exact split expense with splits not totaling amount
2. **Expected**: Validation error

#### Invalid Split Total (Percentage)
1. Create percentage split with total not equal to 100%
2. **Expected**: Validation error

#### No Members Selected
1. Try to create expense without selecting any members
2. **Expected**: Validation error

#### Unauthorized Access
1. Copy a group URL
2. Sign out
3. Try to access the URL
4. **Expected**: Redirected to login

### 6. API Tests

You can test APIs directly using curl or Postman:

#### Get Current User
```bash
curl http://localhost:3000/api/auth/me
```

#### Get Groups
```bash
curl http://localhost:3000/api/groups
```

#### Get Group Balances
```bash
curl "http://localhost:3000/api/balances?group_id=<group-uuid>"
```

## Expected Results Summary

- ✅ Authentication works (signup, login, logout)
- ✅ Groups can be created and viewed
- ✅ Expenses can be created with all split types
- ✅ Balances are calculated correctly
- ✅ Simplified debts are minimized
- ✅ Validation errors are shown appropriately
- ✅ Protected routes require authentication
- ✅ RLS policies enforce data access rules

## Common Issues

### Issue: "Unauthorized" errors
- **Solution**: Check that you're logged in and cookies are set

### Issue: Expense splits don't add up
- **Solution**: Check rounding logic in validation.ts

### Issue: Can't see other users
- **Solution**: Create another account in incognito mode to test multi-user scenarios

### Issue: Database errors
- **Solution**: Verify Supabase connection and RLS policies are applied

## Performance Checks

1. Check that group list loads quickly
2. Check that expense list renders without lag
3. Check that balance calculations are fast (< 100ms)
4. Check that no N+1 queries occur (check browser Network tab)

## Security Checks

1. Try to access another user's group (should fail)
2. Try to delete another user's expense (should fail)
3. Try to add members without admin role (should fail)
4. Check that API responses don't leak sensitive data
