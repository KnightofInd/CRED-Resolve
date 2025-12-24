-- =============================================
-- EXPENSE SHARING APP - COMPLETE DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. GROUPS TABLE
-- =============================================
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_groups_created_by ON groups(created_by);
CREATE INDEX idx_groups_created_at ON groups(created_at DESC);

-- =============================================
-- 2. GROUP MEMBERS TABLE
-- =============================================
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Indexes for faster lookups
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_role ON group_members(group_id, role);

-- =============================================
-- 3. EXPENSES TABLE
-- =============================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  description VARCHAR(500) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  paid_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  split_type VARCHAR(20) NOT NULL CHECK (split_type IN ('equal', 'exact', 'percentage')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX idx_expenses_group_id ON expenses(group_id);
CREATE INDEX idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX idx_expenses_created_at ON expenses(created_at DESC);

-- =============================================
-- 4. EXPENSE SPLITS TABLE
-- =============================================
CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(expense_id, user_id)
);

-- Indexes for faster lookups
CREATE INDEX idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user_id ON expense_splits(user_id);

-- =============================================
-- 5. BALANCES TABLE
-- =============================================
CREATE TABLE balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Indexes for faster lookups
CREATE INDEX idx_balances_group_id ON balances(group_id);
CREATE INDEX idx_balances_user_id ON balances(user_id);

-- =============================================
-- 6. SETTLEMENTS TABLE
-- =============================================
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (from_user_id != to_user_id)
);

-- Indexes for faster lookups
CREATE INDEX idx_settlements_group_id ON settlements(group_id);
CREATE INDEX idx_settlements_from_user ON settlements(from_user_id);
CREATE INDEX idx_settlements_to_user ON settlements(to_user_id);
CREATE INDEX idx_settlements_settled_at ON settlements(settled_at DESC);

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- =============================================
-- GROUPS POLICIES
-- =============================================

-- Users can view groups they are members of
CREATE POLICY "Users can view their groups"
  ON groups FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM group_members WHERE group_id = groups.id
    )
  );

-- Users can create groups
CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Only group admins can update groups
CREATE POLICY "Admins can update groups"
  ON groups FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM group_members 
      WHERE group_id = groups.id AND role = 'admin'
    )
  );

-- Only group admins can delete groups
CREATE POLICY "Admins can delete groups"
  ON groups FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM group_members 
      WHERE group_id = groups.id AND role = 'admin'
    )
  );

-- =============================================
-- GROUP_MEMBERS POLICIES
-- =============================================

-- Users can view members of groups they belong to
CREATE POLICY "Users can view group members"
  ON group_members FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM group_members gm 
      WHERE gm.group_id = group_members.group_id
    )
  );

-- Only group admins can add members
CREATE POLICY "Admins can add members"
  ON group_members FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM group_members 
      WHERE group_id = group_members.group_id AND role = 'admin'
    )
  );

-- Only group admins can remove members
CREATE POLICY "Admins can remove members"
  ON group_members FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM group_members gm
      WHERE gm.group_id = group_members.group_id AND gm.role = 'admin'
    )
  );

-- =============================================
-- EXPENSES POLICIES
-- =============================================

-- Users can view expenses in groups they belong to
CREATE POLICY "Users can view group expenses"
  ON expenses FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM group_members WHERE group_id = expenses.group_id
    )
  );

-- Users can create expenses in groups they belong to
CREATE POLICY "Members can create expenses"
  ON expenses FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM group_members WHERE group_id = expenses.group_id
    )
  );

-- Users can update their own expenses
CREATE POLICY "Users can update their expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = paid_by);

-- Users can delete their own expenses
CREATE POLICY "Users can delete their expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = paid_by);

-- =============================================
-- EXPENSE_SPLITS POLICIES
-- =============================================

-- Users can view splits in groups they belong to
CREATE POLICY "Users can view expense splits"
  ON expense_splits FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM group_members gm
      JOIN expenses e ON e.group_id = gm.group_id
      WHERE e.id = expense_splits.expense_id
    )
  );

-- Only expense creator can create splits
CREATE POLICY "Expense creator can create splits"
  ON expense_splits FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT paid_by FROM expenses WHERE id = expense_splits.expense_id
    )
  );

-- Only expense creator can update splits
CREATE POLICY "Expense creator can update splits"
  ON expense_splits FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT paid_by FROM expenses WHERE id = expense_splits.expense_id
    )
  );

-- Only expense creator can delete splits
CREATE POLICY "Expense creator can delete splits"
  ON expense_splits FOR DELETE
  USING (
    auth.uid() IN (
      SELECT paid_by FROM expenses WHERE id = expense_splits.expense_id
    )
  );

-- =============================================
-- BALANCES POLICIES
-- =============================================

-- Users can view balances in groups they belong to
CREATE POLICY "Users can view group balances"
  ON balances FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM group_members WHERE group_id = balances.group_id
    )
  );

-- System can insert balances (via service role or functions)
CREATE POLICY "System can insert balances"
  ON balances FOR INSERT
  WITH CHECK (true);

-- System can update balances
CREATE POLICY "System can update balances"
  ON balances FOR UPDATE
  USING (true);

-- =============================================
-- SETTLEMENTS POLICIES
-- =============================================

-- Users can view settlements in groups they belong to
CREATE POLICY "Users can view settlements"
  ON settlements FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM group_members WHERE group_id = settlements.group_id
    )
  );

-- Users can create settlements in groups they belong to
CREATE POLICY "Members can create settlements"
  ON settlements FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM group_members WHERE group_id = settlements.group_id
    )
  );

-- =============================================
-- 8. FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for groups table
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for expenses table
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for balances table
CREATE TRIGGER update_balances_updated_at
  BEFORE UPDATE ON balances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 9. FUNCTION TO AUTO-ADD CREATOR AS ADMIN
-- =============================================

-- Function to automatically add group creator as admin
CREATE OR REPLACE FUNCTION add_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to add creator as admin when group is created
CREATE TRIGGER add_group_creator_as_admin
  AFTER INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_admin();

-- =============================================
-- SCHEMA CREATED SUCCESSFULLY
-- =============================================
