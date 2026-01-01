-- ============================================
-- COMPLETE DATABASE SETUP FOR LANDFORM ARCHITECTURE WEBSITE
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- This will create all tables, triggers, RLS policies, and initial data
-- ============================================

-- ============================================
-- 1. LOGO AND NAME TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS logo_and_name (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    logo_url TEXT NOT NULL,
    company_name TEXT DEFAULT 'LANDFORM',
    company_name_color TEXT DEFAULT '#1a1a1a',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE logo_and_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to logo_and_name" ON logo_and_name
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update logo_and_name" ON logo_and_name
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert logo_and_name" ON logo_and_name
    FOR INSERT TO authenticated WITH CHECK (true);

-- Insert default row
INSERT INTO logo_and_name (logo_url, company_name, company_name_color)
VALUES ('/logo.png', 'LANDFORM', '#1a1a1a')
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    background_color TEXT DEFAULT '#ffffff',
    primary_accent_color TEXT DEFAULT '#f97316',
    text_color TEXT DEFAULT '#1a1a1a',
    secondary_text_color TEXT DEFAULT '#6b7280',
    font_family TEXT DEFAULT 'Inter, sans-serif',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to site_settings" ON site_settings
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update site_settings" ON site_settings
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert site_settings" ON site_settings
    FOR INSERT TO authenticated WITH CHECK (true);

-- Insert default settings
INSERT INTO site_settings (background_color, primary_accent_color, text_color, secondary_text_color, font_family)
VALUES ('#ffffff', '#f97316', '#1a1a1a', '#6b7280', 'Inter, sans-serif')
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. HERO SLIDES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to hero_slides" ON hero_slides
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to hero_slides" ON hero_slides
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 4. CEO SECTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ceo_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_url TEXT NOT NULL,
    name TEXT NOT NULL,
    title TEXT DEFAULT 'CEO & Founder',
    vision TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ceo_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to ceo_section" ON ceo_section
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update ceo_section" ON ceo_section
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert ceo_section" ON ceo_section
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- 5. TEAM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_url TEXT,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK (role IN ('ceo', 'leadership', 'manager', 'staff')),
    bio TEXT,
    email TEXT,
    phone TEXT,
    is_ceo BOOLEAN DEFAULT false,
    is_leadership BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to team_members" ON team_members
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to team_members" ON team_members
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 6. PROJECT CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to project_categories" ON project_categories
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to project_categories" ON project_categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default categories
INSERT INTO project_categories (name, slug, display_order, is_active) VALUES
('Residential', 'residential', 1, true),
('Commercial', 'commercial', 2, true),
('Institutional', 'institutional', 3, true),
('Urban', 'urban', 4, true),
('Farmhouse', 'farmhouse', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 7. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    image_url TEXT NOT NULL,
    gallery_images TEXT[],
    category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to projects" ON projects
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users full access to projects" ON projects
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 8. LEARN MORE SECTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS learn_more_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT DEFAULT 'Learn More About Us',
    description TEXT,
    image_url TEXT,
    button_text TEXT DEFAULT 'Learn More',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE learn_more_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to learn_more_section" ON learn_more_section
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update learn_more_section" ON learn_more_section
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert learn_more_section" ON learn_more_section
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- 9. CONTACT INFO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linkedin_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    pinterest_url TEXT,
    email TEXT,
    phone_number TEXT,
    telephone_number TEXT,
    address TEXT,
    google_maps_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to contact_info" ON contact_info
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update contact_info" ON contact_info
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert contact_info" ON contact_info
    FOR INSERT TO authenticated WITH CHECK (true);

-- Insert default contact info
INSERT INTO contact_info (email, phone_number, address)
VALUES ('info@landform.com', '+91 123 456 7890', 'Hyderabad, India')
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. PORTFOLIO HEADER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_header (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT DEFAULT 'Our Portfolio',
    subheading TEXT,
    description TEXT,
    heading_color TEXT,
    subheading_color TEXT,
    description_color TEXT,
    default_items_count INTEGER DEFAULT 6,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolio_header ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to portfolio_header" ON portfolio_header
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update portfolio_header" ON portfolio_header
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert portfolio_header" ON portfolio_header
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- 11. ABOUT INTRO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS about_intro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT DEFAULT 'About Us',
    subheading TEXT,
    description TEXT,
    heading_color TEXT,
    description_color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE about_intro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to about_intro" ON about_intro
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update about_intro" ON about_intro
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert about_intro" ON about_intro
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- 12. PHILOSOPHY PRINCIPLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS philosophy_principles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE philosophy_principles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to philosophy_principles" ON philosophy_principles
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to philosophy_principles" ON philosophy_principles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 13. COLLABORATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    logo_url TEXT NOT NULL,
    name TEXT,
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to collaborations" ON collaborations
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to collaborations" ON collaborations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 14. PRACTICE TIMELINE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS practice_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    title TEXT,
    description TEXT NOT NULL,
    description_color TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE practice_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to practice_timeline" ON practice_timeline
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users full access to practice_timeline" ON practice_timeline
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 15. STAFF INTRO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS staff_intro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT DEFAULT 'Our Team',
    subheading TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE staff_intro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to staff_intro" ON staff_intro
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update staff_intro" ON staff_intro
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert staff_intro" ON staff_intro
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- 16. JOIN TEAM CTA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS join_team_cta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT DEFAULT 'Join Our Team',
    description TEXT,
    button_text TEXT DEFAULT 'View Openings',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE join_team_cta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to join_team_cta" ON join_team_cta
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update join_team_cta" ON join_team_cta
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert join_team_cta" ON join_team_cta
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- 17. HIRING STATUS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hiring_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_hiring BOOLEAN DEFAULT true,
    hiring_title TEXT DEFAULT 'We are Hiring!',
    hiring_description TEXT,
    not_hiring_title TEXT DEFAULT 'No Current Openings',
    not_hiring_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hiring_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to hiring_status" ON hiring_status
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update hiring_status" ON hiring_status
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert hiring_status" ON hiring_status
    FOR INSERT TO authenticated WITH CHECK (true);

-- Insert default hiring status
INSERT INTO hiring_status (is_hiring, hiring_title, hiring_description)
VALUES (true, 'We are Hiring!', 'Join our talented team of architects and designers.')
ON CONFLICT DO NOTHING;

-- ============================================
-- 18. CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    alternative_phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for contact form submissions)
CREATE POLICY "Allow public to insert contact_submissions" ON contact_submissions
    FOR INSERT TO public WITH CHECK (true);

-- Allow authenticated users to read and update (for admin)
CREATE POLICY "Allow authenticated users to read contact_submissions" ON contact_submissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update contact_submissions" ON contact_submissions
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete contact_submissions" ON contact_submissions
    FOR DELETE TO authenticated USING (true);

-- ============================================
-- 19. SITE STATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_projects INTEGER NOT NULL DEFAULT 0,
    team_members INTEGER NOT NULL DEFAULT 0,
    completed_projects INTEGER NOT NULL DEFAULT 0,
    years_of_experience INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_site_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_site_stats_updated_at
BEFORE UPDATE ON site_stats
FOR EACH ROW
EXECUTE FUNCTION update_site_stats_updated_at();

ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to site_stats" ON site_stats
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update site_stats" ON site_stats
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert site_stats" ON site_stats
    FOR INSERT TO authenticated WITH CHECK (true);

-- Insert default row (only one row should exist)
INSERT INTO site_stats (total_projects, team_members, completed_projects, years_of_experience)
VALUES (50, 25, 45, 25)
ON CONFLICT DO NOTHING;

-- ============================================
-- 20. OFFICE GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS office_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE office_gallery ENABLE ROW LEVEL SECURITY;

-- PUBLIC can only READ (for displaying gallery on website)
CREATE POLICY "Enable read access for all users" ON office_gallery
    FOR SELECT USING (true);

-- Only AUTHENTICATED USERS (Admin) can INSERT
CREATE POLICY "Enable insert for authenticated users only" ON office_gallery
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Only AUTHENTICATED USERS (Admin) can UPDATE
CREATE POLICY "Enable update for authenticated users only" ON office_gallery
    FOR UPDATE 
    TO authenticated
    USING (true) 
    WITH CHECK (true);

-- Only AUTHENTICATED USERS (Admin) can DELETE
CREATE POLICY "Enable delete for authenticated users only" ON office_gallery
    FOR DELETE 
    TO authenticated
    USING (true);

-- Create a function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_office_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on row changes
DROP TRIGGER IF EXISTS trigger_update_office_gallery_updated_at ON office_gallery;
CREATE TRIGGER trigger_update_office_gallery_updated_at
    BEFORE UPDATE ON office_gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_office_gallery_updated_at();

-- ============================================
-- 21. JOB POSITIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    job_type VARCHAR(100) DEFAULT 'Full-time',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active positions
CREATE POLICY "Allow public read active job positions" ON job_positions
    FOR SELECT USING (is_active = true);

-- Allow authenticated admin to manage positions
CREATE POLICY "Allow admin full access to job positions" ON job_positions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ============================================
-- STORAGE BUCKETS (Manual Setup Required)
-- ============================================
-- You need to create the following storage buckets in Supabase Dashboard:
-- 
-- 1. Go to Supabase Dashboard > Storage > Click "New bucket"
-- 2. Create the following buckets (all should be PUBLIC for reading):
--
--    - images (for general images like hero slides, team photos, etc.)
--    - projects (for project images and gallery)
--    - office-gallery (for office gallery images)
--    - logos (for logo images)
--
-- 3. For each bucket, set up the following policies:
--    - Public can READ (SELECT)
--    - Authenticated users can INSERT, UPDATE, DELETE
--
-- Example Storage Policies (run after creating buckets):
-- 
-- CREATE POLICY "Public can view images" ON storage.objects
--     FOR SELECT USING (bucket_id = 'images');
-- 
-- CREATE POLICY "Authenticated users can upload images" ON storage.objects
--     FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');
-- 
-- Repeat for other buckets: projects, office-gallery, logos


-- ============================================
-- AUTHENTICATION SETUP
-- ============================================
-- 1. Go to Supabase Dashboard > Authentication > Settings
-- 2. Enable Email/Password sign-in
-- 3. Create an admin user for the admin panel
-- 4. You can also enable other providers like Google if needed


-- ============================================
-- ENVIRONMENT VARIABLES NEEDED
-- ============================================
-- Create a .env.local file in your project root with:
--
-- NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
-- NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
-- SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
--
-- You can find these in Supabase Dashboard > Settings > API


-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these queries to verify all tables were created successfully:

-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Expected tables:
-- about_intro
-- ceo_section
-- collaborations
-- contact_info
-- contact_submissions
-- hero_slides
-- hiring_status
-- job_positions
-- join_team_cta
-- learn_more_section
-- logo_and_name
-- office_gallery
-- philosophy_principles
-- portfolio_header
-- practice_timeline
-- project_categories
-- projects
-- site_settings
-- site_stats
-- staff_intro
-- team_members
