-- Migration script: Upgrade from basic schema to enhanced schema
-- Run this if you already have the basic schema installed

-- Add new columns to existing tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_to UUID;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS card_color VARCHAR(50);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;

-- Add new columns to existing boards table
ALTER TABLE boards ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE boards ADD COLUMN IF NOT EXISTS background_color VARCHAR(50) DEFAULT '#0ea5e9';
ALTER TABLE boards ADD COLUMN IF NOT EXISTS background_image TEXT;
ALTER TABLE boards ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false;
ALTER TABLE boards ADD COLUMN IF NOT EXISTS template_category VARCHAR(100);

-- Create labels table
CREATE TABLE IF NOT EXISTS labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  color VARCHAR(50) DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create board_members junction table
CREATE TABLE IF NOT EXISTS board_members (
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  PRIMARY KEY (board_id, member_id)
);

-- Create task_labels junction table
CREATE TABLE IF NOT EXISTS task_labels (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);

-- Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for assigned_to if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tasks_assigned_to_fkey'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_assigned_to_fkey 
      FOREIGN KEY (assigned_to) REFERENCES members(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_labels_board_id ON labels(board_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_task_id ON checklist_items(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id);

-- Enable RLS on new tables
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Allow all operations on labels" ON labels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on members" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on board_members" ON board_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on task_labels" ON task_labels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on checklist_items" ON checklist_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on comments" ON comments FOR ALL USING (true) WITH CHECK (true);

-- Add trigger for comments
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample labels for existing board
INSERT INTO labels (board_id, name, color) 
SELECT id, 'Bug', '#ef4444' FROM boards WHERE NOT is_template LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO labels (board_id, name, color) 
SELECT id, 'Feature', '#10b981' FROM boards WHERE NOT is_template LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO labels (board_id, name, color) 
SELECT id, 'Design', '#8b5cf6' FROM boards WHERE NOT is_template LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO labels (board_id, name, color) 
SELECT id, 'Documentation', '#f59e0b' FROM boards WHERE NOT is_template LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample members
INSERT INTO members (name, email, color) VALUES
  ('John Doe', 'john@example.com', '#6366f1'),
  ('Jane Smith', 'jane@example.com', '#ec4899'),
  ('Bob Johnson', 'bob@example.com', '#10b981')
ON CONFLICT DO NOTHING;

-- Insert board templates
INSERT INTO boards (title, description, is_template, template_category, background_color) VALUES
  ('Agile Sprint Board', 'Perfect for sprint planning and tracking', true, 'agile', '#8b5cf6'),
  ('Project Roadmap', 'Plan and track project milestones', true, 'project', '#06b6d4'),
  ('Personal Tasks', 'Organize your personal to-dos', true, 'personal', '#10b981'),
  ('Content Calendar', 'Plan and schedule content', true, 'marketing', '#f59e0b')
ON CONFLICT DO NOTHING;

-- Create lists for Agile Sprint template
DO $$
DECLARE
  agile_board_id UUID;
BEGIN
  SELECT id INTO agile_board_id FROM boards WHERE title = 'Agile Sprint Board' AND is_template = true LIMIT 1;
  
  IF agile_board_id IS NOT NULL THEN
    INSERT INTO lists (title, board_id, position) VALUES
      ('Backlog', agile_board_id, 0),
      ('Sprint Planning', agile_board_id, 1),
      ('In Development', agile_board_id, 2),
      ('Testing', agile_board_id, 3),
      ('Done', agile_board_id, 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Migration complete message
DO $$ 
BEGIN
  RAISE NOTICE 'Migration completed successfully! Your database is now upgraded to the enhanced schema.';
END $$;
