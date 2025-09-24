-- 统一数据库初始化脚本
-- 解决所有表结构冲突，提供完整的系统支持

-- 先删除可能存在的冲突表（重新创建以确保结构一致）
DROP TABLE IF EXISTS public.paper_authors CASCADE;
DROP TABLE IF EXISTS public.citations CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.papers CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.scholars CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. 创建用户档案表
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  department TEXT,
  student_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建学科分类表（统一字段结构）
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  paper_count INTEGER DEFAULT 0,
  parent_id UUID REFERENCES public.subjects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建学者表
CREATE TABLE IF NOT EXISTS public.scholars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(50) NOT NULL,
  department VARCHAR(100) NOT NULL,
  research_areas TEXT[] DEFAULT '{}',
  paper_count INTEGER DEFAULT 0,
  citation_count INTEGER DEFAULT 0,
  h_index INTEGER DEFAULT 0,
  avatar_url TEXT,
  email VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建论文表（统一字段结构，支持两种使用场景）
CREATE TABLE IF NOT EXISTS public.papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  english_title TEXT,
  author TEXT NOT NULL,
  authors TEXT[] DEFAULT '{}', -- 支持多作者数组格式
  student_id TEXT,
  supervisor TEXT,
  department TEXT NOT NULL,
  major TEXT,
  degree TEXT,
  degree_type VARCHAR(20) DEFAULT '硕士' CHECK (degree_type IN ('学士', '硕士', '博士')),
  keywords TEXT,
  keywords_array TEXT[] DEFAULT '{}', -- 支持关键词数组格式
  abstract TEXT NOT NULL,
  english_abstract TEXT,
  content TEXT,
  pdf_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'published', 'rejected')),
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  publication_date TIMESTAMP WITH TIME ZONE,
  doi TEXT,
  journal TEXT,
  volume TEXT,
  issue TEXT,
  pages TEXT,
  subject_id UUID REFERENCES public.subjects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建论文作者关联表
CREATE TABLE IF NOT EXISTS public.paper_authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  scholar_id UUID REFERENCES public.scholars(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  is_corresponding_author BOOLEAN DEFAULT false,
  author_order INTEGER DEFAULT 1,
  affiliation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建引用表
CREATE TABLE IF NOT EXISTS public.citations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  citing_paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  cited_paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  citation_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 创建评审表
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  score INTEGER CHECK (score >= 1 AND score <= 5),
  comments TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);
CREATE INDEX IF NOT EXISTS idx_subjects_parent ON public.subjects(parent_id);
CREATE INDEX IF NOT EXISTS idx_scholars_department ON public.scholars(department);
CREATE INDEX IF NOT EXISTS idx_scholars_research_areas ON public.scholars USING gin(research_areas);
CREATE INDEX IF NOT EXISTS idx_papers_author ON public.papers(author);
CREATE INDEX IF NOT EXISTS idx_papers_department ON public.papers(department);
CREATE INDEX IF NOT EXISTS idx_papers_status ON public.papers(status);
CREATE INDEX IF NOT EXISTS idx_papers_keywords ON public.papers(keywords);
CREATE INDEX IF NOT EXISTS idx_papers_keywords_array ON public.papers USING gin(keywords_array);
CREATE INDEX IF NOT EXISTS idx_papers_subject ON public.papers(subject_id);
CREATE INDEX IF NOT EXISTS idx_papers_submission_date ON public.papers(submission_date);
CREATE INDEX IF NOT EXISTS idx_paper_authors_paper ON public.paper_authors(paper_id);
CREATE INDEX IF NOT EXISTS idx_paper_authors_scholar ON public.paper_authors(scholar_id);

-- 启用行级安全性 (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略

-- Profiles表策略
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subjects表策略（公开读取）
CREATE POLICY "Allow read access for all users" ON public.subjects
  FOR SELECT USING (true);

-- Scholars表策略（公开读取）
CREATE POLICY "Allow read access for all users" ON public.scholars
  FOR SELECT USING (true);

-- Papers表策略
CREATE POLICY "Allow read access for published papers" ON public.papers
  FOR SELECT USING (status = 'published' OR auth.uid() = user_id);
CREATE POLICY "Users can insert own papers" ON public.papers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own papers" ON public.papers
  FOR UPDATE USING (auth.uid() = user_id);

-- Paper_authors表策略（公开读取）
CREATE POLICY "Allow read access for all users" ON public.paper_authors
  FOR SELECT USING (true);

-- Citations表策略（公开读取）
CREATE POLICY "Allow read access for all users" ON public.citations
  FOR SELECT USING (true);

-- Reviews表策略
CREATE POLICY "Reviewers can view assigned reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = reviewer_id);
CREATE POLICY "Reviewers can update assigned reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- 授予权限
GRANT SELECT ON public.subjects TO anon;
GRANT SELECT ON public.scholars TO anon;
GRANT SELECT ON public.papers TO anon;
GRANT SELECT ON public.paper_authors TO anon;
GRANT SELECT ON public.citations TO anon;

GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.subjects TO authenticated;
GRANT ALL ON public.scholars TO authenticated;
GRANT ALL ON public.papers TO authenticated;
GRANT ALL ON public.paper_authors TO authenticated;
GRANT ALL ON public.citations TO authenticated;
GRANT ALL ON public.reviews TO authenticated;

-- 创建自动更新时间戳的函数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_scholars_updated_at
  BEFORE UPDATE ON public.scholars
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_papers_updated_at
  BEFORE UPDATE ON public.papers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();