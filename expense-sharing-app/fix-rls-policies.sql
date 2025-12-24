-- =============================================
-- FIX: Remove infinite recursion in group_members policies
-- =============================================

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view group members" ON group_members;
DROP POLICY IF EXISTS "Admins can add members" ON group_members;
DROP POLICY IF EXISTS "Admins can remove members" ON group_members;

-- =============================================
-- FIXED GROUP_MEMBERS POLICIES (No recursion)
-- =============================================

-- Users can view ALL group members (simpler, no recursion)
CREATE POLICY "Users can view group members"
  ON group_members FOR SELECT
  USING (true);  -- Allow all authenticated users to see group members

-- For INSERT: Allow the group creator to add the first admin member
-- AND allow existing admins to add new members
CREATE POLICY "Admins can add members"
  ON group_members FOR INSERT
  WITH CHECK (
    -- Allow if user is adding themselves as the first member (group creator)
    (auth.uid() = user_id AND NOT EXISTS (
      SELECT 1 FROM group_members WHERE group_id = group_members.group_id
    ))
    OR
    -- Allow if user is already an admin in this group (use EXISTS to avoid recursion)
    EXISTS (
      SELECT 1 FROM group_members existing
      WHERE existing.group_id = group_members.group_id 
        AND existing.user_id = auth.uid() 
        AND existing.role = 'admin'
    )
  );

-- Only group admins can remove members (use EXISTS to avoid recursion)
CREATE POLICY "Admins can remove members"
  ON group_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM group_members existing
      WHERE existing.group_id = group_members.group_id 
        AND existing.user_id = auth.uid() 
        AND existing.role = 'admin'
    )
  );
