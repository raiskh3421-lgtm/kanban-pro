-- Enhanced schema with all features

-- Create boards table with themes
CREATE TABLE IF NOT EXISTS boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  background_color VARCHAR(50) DEFAULT '#0ea5e9',
  background_image TEXT,
  is_template BOOLEAN DEFAULT false,
  template_category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lists table
CREATE TABLE IF NOT EXISTS lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create labels table
CREATE TABLE IF NOT EXISTS labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table (for assignments)
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

-- Create enhanced tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES members(id) ON DELETE SET NULL,
  card_color VARCHAR(50),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lists_board_id ON lists(board_id);
CREATE INDEX IF NOT EXISTS idx_lists_position ON lists(board_id, position);
CREATE INDEX IF NOT EXISTS idx_tasks_list_id ON tasks(list_id);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(list_id, position);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_labels_board_id ON labels(board_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_task_id ON checklist_items(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id);

-- Enable Row Level Security (RLS)
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust for auth later)
CREATE POLICY "Allow all operations on boards" ON boards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on lists" ON lists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on labels" ON labels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on members" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on board_members" ON board_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on task_labels" ON task_labels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on checklist_items" ON checklist_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on comments" ON comments FOR ALL USING (true) WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO boards (id, title, description, background_color) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'My First Board', 'Welcome to your first board!', '#0ea5e9');

INSERT INTO lists (title, board_id, position) VALUES
  ('To Do', '550e8400-e29b-41d4-a716-446655440000', 0),
  ('In Progress', '550e8400-e29b-41d4-a716-446655440000', 1),
  ('Done', '550e8400-e29b-41d4-a716-446655440000', 2);

-- Insert sample labels
INSERT INTO labels (board_id, name, color) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Bug', '#ef4444'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Feature', '#10b981'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Design', '#8b5cf6'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Documentation', '#f59e0b');

-- Insert sample members
INSERT INTO members (name, email, color) VALUES
  ('John Doe', 'john@example.com', '#6366f1'),
  ('Jane Smith', 'jane@example.com', '#ec4899'),
  ('Bob Johnson', 'bob@example.com', '#10b981');

-- Create board templates
INSERT INTO boards (title, description, is_template, template_category, background_color) VALUES
  ('Agile Sprint Board', 'Perfect for sprint planning and tracking', true, 'agile', '#8b5cf6'),
  ('Project Roadmap', 'Plan and track project milestones', true, 'project', '#06b6d4'),
  ('Personal Tasks', 'Organize your personal to-dos', true, 'personal', '#10b981'),
  ('Content Calendar', 'Plan and schedule content', true, 'marketing', '#f59e0b');

-- Create lists for Agile Sprint template
INSERT INTO lists (title, board_id, position) 
SELECT 'Backlog', id, 0 FROM boards WHERE title = 'Agile Sprint Board' AND is_template = true;

INSERT INTO lists (title, board_id, position) 
SELECT 'Sprint Planning', id, 1 FROM boards WHERE title = 'Agile Sprint Board' AND is_template = true;

INSERT INTO lists (title, board_id, position) 
SELECT 'In Development', id, 2 FROM boards WHERE title = 'Agile Sprint Board' AND is_template = true;

INSERT INTO lists (title, board_id, position) 
SELECT 'Testing', id, 3 FROM boards WHERE title = 'Agile Sprint Board' AND is_template = true;

INSERT INTO lists (title, board_id, position) 
SELECT 'Done', id, 4 FROM boards WHERE title = 'Agile Sprint Board' AND is_template = true;
