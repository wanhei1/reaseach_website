-- 创建论文表
CREATE TABLE IF NOT EXISTS papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  english_title TEXT,
  author TEXT NOT NULL,
  student_id TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  department TEXT NOT NULL,
  major TEXT NOT NULL,
  degree TEXT NOT NULL,
  keywords TEXT,
  abstract TEXT NOT NULL,
  english_abstract TEXT,
  defense_date DATE,
  confidential_level TEXT DEFAULT 'public',
  file_paths JSONB,
  agreements JSONB,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_papers_user_id ON papers(user_id);
CREATE INDEX IF NOT EXISTS idx_papers_status ON papers(status);
CREATE INDEX IF NOT EXISTS idx_papers_department ON papers(department);
CREATE INDEX IF NOT EXISTS idx_papers_submitted_at ON papers(submitted_at);

-- 启用行级安全策略
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的论文
CREATE POLICY "Users can view own papers" ON papers
  FOR SELECT USING (auth.uid() = user_id);

-- 创建策略：用户只能插入自己的论文
CREATE POLICY "Users can insert own papers" ON papers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能更新自己的论文
CREATE POLICY "Users can update own papers" ON papers
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建存储桶（如果不存在）
INSERT INTO storage.buckets (id, name, public)
VALUES ('papers', 'papers', false) ON CONFLICT DO NOTHING;

-- 创建存储策略：用户只能上传到自己的文件夹
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'papers' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 创建存储策略：用户只能查看自己的文件
CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'papers' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );