import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTeamMembers, getAboutIntro, getCollaborations, getPracticeTimeline, getCeoSection, getJoinTeamCta, getSiteStats, getOfficeGalleryImages } from '@/lib/queries';
import { ArrowRight } from 'lucide-react';
import OfficeGallery from '@/components/about/OfficeGallery';

export const metadata: Metadata = {
    title: 'About Us | LAND 8 FORM',
    description: 'Learn about our architectural philosophy, leadership team, and the journey that shaped our practice.',
};

export default async function AboutPage() {
    const [aboutIntro, teamMembers, collaborations, timeline, ceo, joinTeamCta, siteStats, officeGalleryImages] = await Promise.all([
        getAboutIntro(),
        getTeamMembers(),
        getCollaborations(),
        getPracticeTimeline(),
        getCeoSection(),
        getJoinTeamCta(),
        getSiteStats(),
        getOfficeGalleryImages(),
    ]);

    const leadership = teamMembers.filter((m) => m.role === 'leadership' || m.role === 'ceo');

    const intro = aboutIntro || {
        heading: 'Who Are We',
        subheading: 'About Our Practice',
        description: 'We are a collective of visionary architects, designers, and innovators dedicated to transforming spaces and enriching lives through thoughtful design.',
    };

    // Get stats from database or use defaults
    const stats = [
        { value: `${siteStats?.total_projects ?? 50}+`, label: 'Total Projects' },
        { value: siteStats?.team_members ?? 25, label: 'Team Members' },
        { value: `${siteStats?.completed_projects ?? 45}+`, label: 'Completed Projects' },
        { value: `${siteStats?.years_of_experience ?? 25}+`, label: 'Office Journey' },
    ];

    return (
        <div className="pt-20">
            {/* Section 1: Who Are We */}
            <section className="section">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
                            {intro.heading}
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary-accent)] mb-8">
                            {intro.subheading}
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                            {intro.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section pt-0">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="glass p-8 rounded-2xl text-center">
                                <div className="text-4xl md:text-5xl font-bold text-[var(--primary-accent)] mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-[var(--text-secondary)]">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Office Gallery Section */}
            {officeGalleryImages.length > 0 && (
                <section className="section bg-gradient-to-br from-[var(--background)] via-[var(--background-secondary)] to-[var(--background)]">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="section-title centered text-center mx-auto">
                                Office Gallery
                            </h2>
                            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mt-4">
                                Take a glimpse into our creative workspace where innovative ideas come to life.
                            </p>
                        </div>

                        {/* Gallery with Lightbox */}
                        <OfficeGallery images={officeGalleryImages} />
                    </div>
                </section>
            )}

            {/* Team Members Section */}
            {teamMembers.length > 0 && (
                <section className="section bg-[var(--background-secondary)]">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="section-title centered text-center mx-auto">
                                Meet Our Team
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {teamMembers.map((member) => (
                                <div key={member.id} className="card overflow-hidden group">
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <Image
                                            src={member.photo_url || '/placeholder-person.jpg'}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                            <p className="text-[var(--primary-accent)] font-medium">{member.position}</p>
                                        </div>
                                    </div>
                                    {member.bio && (
                                        <div className="p-4">
                                            <p className="text-[var(--text-secondary)] text-sm">{member.bio}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Collaborations Section - Premium Style */}
            {collaborations.length > 0 && (
                <section className="section collaboration-section relative overflow-hidden bg-gradient-to-br from-[#3a3a3a] via-[#2d2d2d] to-[#252525]">
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-accent)]/5 via-transparent to-[var(--primary-accent)]/5 pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="section-title centered text-center mx-auto text-3xl md:text-4xl lg:text-5xl font-bold" style={{ fontFamily: '"Arial Rounded MT Bold", "Nunito", sans-serif' }}>
                                Our Collaborations
                            </h2>
                            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mt-4" style={{ fontFamily: '"Arial Rounded MT Bold", "Nunito", sans-serif' }}>
                                We work with industry-leading partners to deliver exceptional results for our clients.
                            </p>
                        </div>

                        {/* Glossy Container for Logo Marquee */}
                        <div className="relative rounded-2xl p-6 overflow-hidden
                            bg-gradient-to-br from-[rgba(58,58,58,0.6)] via-[rgba(45,45,45,0.5)] to-[rgba(35,35,35,0.6)]
                            backdrop-blur-xl border border-[rgba(255,255,255,0.08)]
                            shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">

                            {/* Top shine effect */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/3 to-transparent rounded-t-2xl" />
                            </div>

                            {/* Subtle accent border */}
                            <div className="absolute inset-0 rounded-2xl border border-[var(--primary-accent)]/10 pointer-events-none" />

                            {/* Auto-Scrolling Logo Marquee */}
                            <div className="relative overflow-hidden">
                                {/* Gradient overlays for fade effect */}
                                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[rgba(45,45,45,0.95)] to-transparent z-10 pointer-events-none" />
                                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[rgba(45,45,45,0.95)] to-transparent z-10 pointer-events-none" />

                                {/* Scrolling container - scrolls on hover */}
                                <div className="flex animate-scroll-left py-4">
                                    {/* First set of logos */}
                                    <div className="flex gap-12 items-center shrink-0 px-6">
                                        {collaborations.map((collab) => (
                                            <a
                                                key={collab.id}
                                                href={collab.website_url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="relative w-32 h-16 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 flex-shrink-0 hover:scale-110"
                                            >
                                                <Image
                                                    src={collab.logo_url}
                                                    alt={collab.name || 'Partner'}
                                                    fill
                                                    className="object-contain drop-shadow-md"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                    {/* Duplicate set for seamless loop */}
                                    <div className="flex gap-12 items-center shrink-0 px-6">
                                        {collaborations.map((collab) => (
                                            <a
                                                key={`dup-${collab.id}`}
                                                href={collab.website_url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="relative w-32 h-16 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 flex-shrink-0 hover:scale-110"
                                            >
                                                <Image
                                                    src={collab.logo_url}
                                                    alt={collab.name || 'Partner'}
                                                    fill
                                                    className="object-contain drop-shadow-md"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Join Team CTA Section - Premium Glossy */}
            {joinTeamCta && (
                <section className="section bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background)]">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="relative rounded-3xl p-8 md:p-12 lg:p-16 text-center overflow-hidden
                                bg-gradient-to-br from-[rgba(58,58,58,0.9)] via-[rgba(45,45,45,0.85)] to-[rgba(35,35,35,0.9)]
                                backdrop-blur-xl border border-[rgba(255,255,255,0.15)]
                                shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-1px_0_0_rgba(0,0,0,0.2)]
                            ">
                                {/* Glossy overlay - top shine */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-3xl" />
                                </div>

                                {/* Glowing accent border */}
                                <div className="absolute inset-0 rounded-3xl border border-[var(--primary-accent)]/20 pointer-events-none" />

                                {/* Decorative blur elements */}
                                <div className="absolute top-0 left-0 w-60 h-60 bg-[var(--primary-accent)]/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--primary-accent)]/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-[var(--primary-accent)]/5 blur-3xl" />

                                {/* Shimmer effect */}
                                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 animate-shimmer" />
                                </div>

                                <div className="relative z-10">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6 drop-shadow-lg">
                                        {joinTeamCta.heading}
                                    </h2>
                                    {joinTeamCta.description && (
                                        <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
                                            {joinTeamCta.description}
                                        </p>
                                    )}
                                    <Link
                                        href="/careers"
                                        className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg shadow-lg shadow-[var(--primary-accent)]/30 hover:shadow-xl hover:shadow-[var(--primary-accent)]/40 transition-all duration-300"
                                    >
                                        {joinTeamCta.button_text}
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
