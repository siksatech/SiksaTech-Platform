-- ============================================================
-- Migration 010: SiksaTech Custom ID
-- SiksaTech Platform
-- ============================================================

-- Add siksa_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS siksa_id TEXT UNIQUE;

-- We need a function to generate a random 6-digit number string
CREATE OR REPLACE FUNCTION public.generate_siksa_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  done BOOLEAN DEFAULT FALSE;
BEGIN
  WHILE NOT done LOOP
    -- Generate a 6-digit random number between 100000 and 999999
    new_id := (floor(random() * (999999 - 100000 + 1) + 100000))::TEXT;
    
    -- Check if it already exists in profiles
    PERFORM 1 FROM public.profiles WHERE siksa_id = new_id;
    IF NOT FOUND THEN
      done := TRUE;
    END IF;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Update the handle_new_user trigger to assign siksa_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    display_name,
    avatar_url,
    role,
    is_profile_complete,
    siksa_id
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'student'), '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'student'), '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    false,
    public.generate_siksa_id()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    siksa_id = COALESCE(public.profiles.siksa_id, EXCLUDED.siksa_id),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
