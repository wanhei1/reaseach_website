-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  department TEXT,
  position TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.subjects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create papers table
CREATE TABLE IF NOT EXISTS public.papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  abstract TEXT,
  keywords TEXT[],
  authors TEXT[] NOT NULL,
  subject_id UUID REFERENCES public.subjects(id),
  publication_date DATE,
  journal TEXT,
  volume TEXT,
  issue TEXT,
  pages TEXT,
  doi TEXT,
  pdf_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'published', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create paper_authors table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.paper_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_order INTEGER NOT NULL,
  is_corresponding BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(paper_id, user_id)
);

-- Create citations table
CREATE TABLE IF NOT EXISTS public.citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citing_paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  cited_paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(citing_paper_id, cited_paper_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  recommendation TEXT CHECK (recommendation IN ('accept', 'minor_revision', 'major_revision', 'reject')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Subjects policies (public read, admin write)
CREATE POLICY "subjects_select_all" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "subjects_insert_admin" ON public.subjects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "subjects_update_admin" ON public.subjects FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Papers policies
CREATE POLICY "papers_select_all" ON public.papers FOR SELECT TO authenticated USING (true);
CREATE POLICY "papers_insert_own" ON public.papers FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "papers_update_own" ON public.papers FOR UPDATE USING (auth.uid() = submitted_by);
CREATE POLICY "papers_delete_own" ON public.papers FOR DELETE USING (auth.uid() = submitted_by);

-- Paper authors policies
CREATE POLICY "paper_authors_select_all" ON public.paper_authors FOR SELECT TO authenticated USING (true);
CREATE POLICY "paper_authors_insert_own" ON public.paper_authors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "paper_authors_update_own" ON public.paper_authors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "paper_authors_delete_own" ON public.paper_authors FOR DELETE USING (auth.uid() = user_id);

-- Citations policies
CREATE POLICY "citations_select_all" ON public.citations FOR SELECT TO authenticated USING (true);
CREATE POLICY "citations_insert_auth" ON public.citations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Reviews policies
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);
