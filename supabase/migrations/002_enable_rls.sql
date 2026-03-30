-- Enable RLS on all tables
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (service role bypasses RLS anyway)
CREATE POLICY allow_all_memories ON memories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_stories ON stories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_tags ON tags FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_memory_tags ON memory_tags FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_story_tags ON story_tags FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;
