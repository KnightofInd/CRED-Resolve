-- FINAL FIX: Clean RLS policies for group creation
-- Run this in Supabase SQL Editor

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Admins can add members" ON group_members;
DROP POLICY IF EXISTS "allow_all_groups" ON groups;
DROP POLICY IF EXISTS "allow_all_members" ON group_members;

-- Create simple, working policies
CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can add members"
  ON group_members FOR INSERT
  WITH CHECK (
    -- Allow if user is the group creator
    EXISTS (
      SELECT 1 FROM groups 
      WHERE groups.id = group_members.group_id 
        AND groups.created_by = auth.uid()
    )
    OR
    -- Allow if user is already an admin
    EXISTS (
      SELECT 1 FROM group_members existing
      WHERE existing.group_id = group_members.group_id 
        AND existing.user_id = auth.uid() 
        AND existing.role = 'admin'
    )
  );
