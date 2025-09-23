-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update paper statistics
CREATE OR REPLACE FUNCTION public.get_paper_stats()
RETURNS TABLE (
  total_papers BIGINT,
  published_papers BIGINT,
  under_review_papers BIGINT,
  total_citations BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_papers,
    COUNT(*) FILTER (WHERE status = 'published') as published_papers,
    COUNT(*) FILTER (WHERE status = 'under_review') as under_review_papers,
    (SELECT COUNT(*) FROM public.citations) as total_citations
  FROM public.papers;
END;
$$;
