import { Metadata } from 'next';
import Image from 'next/image';
import { getTeamMembers, getStaffIntro, getJoinTeamCta, getCeoSection } from '@/lib/queries';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Our Staff | LAND 8 FORM',
    description: 'Meet the talented team behind our architectural achievements.',
};

export default async function StaffPage() {
    const [teamMembers, staffIntro, joinTeamCta, ceoSection] = await Promise.all([
        getTeamMembers(),
        getStaffIntro(),
        getJoinTeamCta(),
        getCeoSection(),
    ]);

    // Use CEO from ceo_section table (same as home page)
    const displayCeo = ceoSection || {
        id: '1',
        photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
        name: 'Alexander Mitchell',
        title: 'Chief Executive Officer & Founder',
        vision: 'Building sustainable futures through innovative design.',
        description: 'With over 25 years of experience in architectural design and urban planning, Alexander has led our firm to become a leading force in sustainable and innovative architecture.',
    };

    const otherMembers = teamMembers.filter((m) => m.role !== 'ceo');

    const intro = staffIntro || {
        heading: 'Our People',
        description: 'At the heart of our success lies our exceptional team. We believe in fostering a culture of creativity, collaboration, and continuous learning.',
    };

    const defaultTeam = [
        { id: '2', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', name: 'Sarah Chen', position: 'Chief Design Officer', bio: 'Award-winning designer with expertise in sustainable architecture.' },
        { id: '3', photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', name: 'Michael Torres', position: 'Director of Operations', bio: 'Expert in project management ensuring seamless execution.' },
        { id: '4', photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', name: 'Emily Reynolds', position: 'Head of Innovation', bio: 'Pioneering new technologies in architectural design.' },
    ];

    const displayTeam = otherMembers.length > 0 ? otherMembers : defaultTeam;

    const ctaData = joinTeamCta || {
        heading: 'Join Our Team',
        description: 'We are always looking for talented individuals to join our growing team.',
        button_text: 'View Careers',
    };

    return (
        <div className="pt-20">
            {/* Section 1: CEO Spotlight - Uses same ceo_section as home page */}
            <section className="section">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="relative">
                            <div className="relative aspect-[4/5] max-w-lg mx-auto lg:mx-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-accent)] to-[var(--primary-accent-hover)] rounded-3xl transform rotate-3 opacity-20" />
                                <div className="relative h-full rounded-3xl overflow-hidden border-2 border-[var(--glass-border)]">
                                    <Image
                                        src={displayCeo.photo_url || '/placeholder-person.jpg'}
                                        alt={displayCeo.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="inline-block text-[var(--primary-accent)] font-semibold text-sm uppercase tracking-wider mb-4">
                                Leadership
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-2">
                                {displayCeo.name}
                            </h1>
                            <p className="text-[var(--primary-accent)] font-semibold text-xl mb-8">
                                {displayCeo.title}
                            </p>
                            {displayCeo.vision && (
                                <blockquote className="text-[var(--text-secondary)] text-xl italic mb-6 border-l-4 border-[var(--primary-accent)] pl-4">
                                    "{displayCeo.vision}"
                                </blockquote>
                            )}
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                                {displayCeo.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Team */}
            <section className="section bg-[var(--background-secondary)]">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="inline-block text-[var(--primary-accent)] font-semibold text-sm uppercase tracking-wider mb-4">
                            Our Team
                        </span>
                        <h2 className="section-title centered text-center mx-auto">
                            {intro.heading}
                        </h2>
                        <p className="text-[var(--text-secondary)] text-lg mt-6 leading-relaxed">
                            {intro.description}
                        </p>
                    </div>

                    <div className="grid-responsive">
                        {displayTeam.map((member) => (
                            <div key={member.id} className="card overflow-hidden group">
                                <div className="relative aspect-square overflow-hidden">
                                    <Image
                                        src={member.photo_url || '/placeholder-person.jpg'}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-[var(--primary-accent)] text-sm font-medium mb-2">
                                        {member.position}
                                    </p>
                                    {member.bio && (
                                        <p className="text-[var(--text-secondary)] text-sm line-clamp-2">
                                            {member.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Join Team CTA */}
            <section className="section">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center glass p-12 rounded-3xl">
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                            {ctaData.heading}
                        </h2>
                        <p className="text-[var(--text-secondary)] text-lg mb-8">
                            {ctaData.description}
                        </p>
                        <Link href="/careers" className="btn-primary">
                            {ctaData.button_text || 'View Careers'}
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
