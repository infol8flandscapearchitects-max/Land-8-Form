// Database Types for Supabase Tables
// Based on the actual Supabase schema

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// ============================================
// Table Row Types (what you GET from database)
// ============================================

export interface LogoAndName {
    id: string;
    logo_url: string;
    company_name: string;
    company_name_color: string;
    created_at: string;
    updated_at: string;
}

export interface SiteSettings {
    id: string;
    background_color: string;
    primary_accent_color: string;
    text_color: string;
    secondary_text_color: string;
    font_family: string;
    created_at: string;
    updated_at: string;
}

export interface HeroSlide {
    id: string;
    image_url: string;
    title: string | null;
    subtitle: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CeoSection {
    id: string;
    photo_url: string;
    name: string;
    title: string;
    vision: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface TeamMember {
    id: string;
    photo_url: string | null;
    name: string;
    position: string;
    role: 'ceo' | 'leadership' | 'manager' | 'staff';
    bio: string | null;
    email: string | null;
    phone: string | null;
    is_ceo: boolean;
    is_leadership: boolean;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProjectCategory {
    id: string;
    name: string;
    slug: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export interface Project {
    id: string;
    title: string;
    description: string | null;
    short_description: string | null;
    image_url: string;
    gallery_images: string[] | null;
    category_id: string | null;
    status: 'upcoming' | 'ongoing' | 'completed';
    is_featured: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
    category?: ProjectCategory;
}

export interface LearnMoreSection {
    id: string;
    heading: string;
    description: string | null;
    image_url: string | null;
    button_text: string;
    created_at: string;
    updated_at: string;
}

export interface ContactInfo {
    id: string;
    linkedin_url: string | null;
    instagram_url: string | null;
    youtube_url: string | null;
    pinterest_url: string | null;
    email: string | null;
    phone_number: string | null;
    telephone_number: string | null;
    address: string | null;
    google_maps_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface PortfolioHeader {
    id: string;
    heading: string;
    subheading: string | null;
    description: string | null;
    heading_color: string | null;
    subheading_color: string | null;
    description_color: string | null;
    default_items_count: number;
    created_at: string;
    updated_at: string;
}

export interface AboutIntro {
    id: string;
    heading: string;
    subheading: string | null;
    description: string | null;
    heading_color: string | null;
    description_color: string | null;
    created_at: string;
    updated_at: string;
}

export interface PhilosophyPrinciple {
    id: string;
    title: string;
    description: string | null;
    icon_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Collaboration {
    id: string;
    logo_url: string;
    name: string | null;
    website_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PracticeTimeline {
    id: string;
    year: number;
    title: string | null;
    description: string;
    description_color: string | null;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface StaffIntro {
    id: string;
    heading: string;
    subheading: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface JoinTeamCTA {
    id: string;
    heading: string;
    description: string | null;
    button_text: string;
    created_at: string;
    updated_at: string;
}

export interface HiringStatus {
    id: string;
    is_hiring: boolean;
    hiring_title: string | null;
    hiring_description: string | null;
    not_hiring_title: string | null;
    not_hiring_description: string | null;
    created_at: string;
    updated_at: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone: string;
    alternative_phone: string | null;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export interface SiteStats {
    id: string;
    total_projects: number;
    team_members: number;
    completed_projects: number;
    years_of_experience: number;
    created_at: string;
    updated_at: string;
}

export interface OfficeGalleryImage {
    id: string;
    image_url: string;
    title: string | null;
    description: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface JobPosition {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    job_type: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ============================================
// Form Input Types (for INSERT/UPDATE)
// ============================================

export type LogoAndNameInput = Omit<LogoAndName, 'id' | 'created_at' | 'updated_at'>;
export type SiteSettingsInput = Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>;
export type HeroSlideInput = Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>;
export type CeoSectionInput = Omit<CeoSection, 'id' | 'created_at' | 'updated_at'>;
export type TeamMemberInput = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>;
export type ProjectCategoryInput = Omit<ProjectCategory, 'id' | 'created_at'>;
export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'category'>;
export type LearnMoreSectionInput = Omit<LearnMoreSection, 'id' | 'created_at' | 'updated_at'>;
export type ContactInfoInput = Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>;
export type PortfolioHeaderInput = Omit<PortfolioHeader, 'id' | 'created_at' | 'updated_at'>;
export type AboutIntroInput = Omit<AboutIntro, 'id' | 'created_at' | 'updated_at'>;
export type PhilosophyPrincipleInput = Omit<PhilosophyPrinciple, 'id' | 'created_at' | 'updated_at'>;
export type CollaborationInput = Omit<Collaboration, 'id' | 'created_at' | 'updated_at'>;
export type PracticeTimelineInput = Omit<PracticeTimeline, 'id' | 'created_at' | 'updated_at'>;
export type StaffIntroInput = Omit<StaffIntro, 'id' | 'created_at' | 'updated_at'>;
export type JoinTeamCTAInput = Omit<JoinTeamCTA, 'id' | 'created_at' | 'updated_at'>;
export type HiringStatusInput = Omit<HiringStatus, 'id' | 'created_at' | 'updated_at'>;
export type ContactSubmissionInput = Omit<ContactSubmission, 'id' | 'created_at' | 'is_read'>;
export type SiteStatsInput = Omit<SiteStats, 'id' | 'created_at' | 'updated_at'>;
export type OfficeGalleryImageInput = Omit<OfficeGalleryImage, 'id' | 'created_at' | 'updated_at'>;
export type JobPositionInput = Omit<JobPosition, 'id' | 'created_at' | 'updated_at'>;

// ============================================
// Filter Types
// ============================================

export interface ProjectFilters {
    categoryId?: string;
    status?: 'upcoming' | 'ongoing' | 'completed';
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
}

// ============================================
// Dashboard Stats
// ============================================

export interface DashboardStats {
    totalProjects: number;
    totalTeamMembers: number;
    totalContactSubmissions: number;
    unreadSubmissions: number;
    featuredProjects: number;
    yearsOfExperience: number;
}

// ============================================
// Supabase Database Type Definition
// ============================================

export interface Database {
    public: {
        Tables: {
            logo_and_name: {
                Row: LogoAndName;
                Insert: Partial<LogoAndNameInput> & { logo_url: string };
                Update: Partial<LogoAndNameInput>;
            };
            site_settings: {
                Row: SiteSettings;
                Insert: Partial<SiteSettingsInput>;
                Update: Partial<SiteSettingsInput>;
            };
            hero_slides: {
                Row: HeroSlide;
                Insert: Partial<HeroSlideInput> & { image_url: string };
                Update: Partial<HeroSlideInput>;
            };
            ceo_section: {
                Row: CeoSection;
                Insert: Partial<CeoSectionInput> & { photo_url: string; name: string };
                Update: Partial<CeoSectionInput>;
            };
            team_members: {
                Row: TeamMember;
                Insert: Partial<TeamMemberInput> & { name: string; position: string };
                Update: Partial<TeamMemberInput>;
            };
            project_categories: {
                Row: ProjectCategory;
                Insert: Partial<ProjectCategoryInput> & { name: string; slug: string };
                Update: Partial<ProjectCategoryInput>;
            };
            projects: {
                Row: Project;
                Insert: Partial<ProjectInput> & { title: string; image_url: string };
                Update: Partial<ProjectInput>;
            };
            learn_more_section: {
                Row: LearnMoreSection;
                Insert: Partial<LearnMoreSectionInput>;
                Update: Partial<LearnMoreSectionInput>;
            };
            contact_info: {
                Row: ContactInfo;
                Insert: Partial<ContactInfoInput>;
                Update: Partial<ContactInfoInput>;
            };
            portfolio_header: {
                Row: PortfolioHeader;
                Insert: Partial<PortfolioHeaderInput>;
                Update: Partial<PortfolioHeaderInput>;
            };
            about_intro: {
                Row: AboutIntro;
                Insert: Partial<AboutIntroInput>;
                Update: Partial<AboutIntroInput>;
            };
            philosophy_principles: {
                Row: PhilosophyPrinciple;
                Insert: Partial<PhilosophyPrincipleInput> & { title: string };
                Update: Partial<PhilosophyPrincipleInput>;
            };
            collaborations: {
                Row: Collaboration;
                Insert: Partial<CollaborationInput> & { logo_url: string };
                Update: Partial<CollaborationInput>;
            };
            practice_timeline: {
                Row: PracticeTimeline;
                Insert: Partial<PracticeTimelineInput> & { year: number; description: string };
                Update: Partial<PracticeTimelineInput>;
            };
            staff_intro: {
                Row: StaffIntro;
                Insert: Partial<StaffIntroInput>;
                Update: Partial<StaffIntroInput>;
            };
            join_team_cta: {
                Row: JoinTeamCTA;
                Insert: Partial<JoinTeamCTAInput>;
                Update: Partial<JoinTeamCTAInput>;
            };
            hiring_status: {
                Row: HiringStatus;
                Insert: Partial<HiringStatusInput>;
                Update: Partial<HiringStatusInput>;
            };
            contact_submissions: {
                Row: ContactSubmission;
                Insert: ContactSubmissionInput;
                Update: Partial<Pick<ContactSubmission, 'is_read'>>;
            };
            site_stats: {
                Row: SiteStats;
                Insert: Partial<SiteStatsInput>;
                Update: Partial<SiteStatsInput>;
            };
            office_gallery: {
                Row: OfficeGalleryImage;
                Insert: Partial<OfficeGalleryImageInput> & { image_url: string };
                Update: Partial<OfficeGalleryImageInput>;
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}
