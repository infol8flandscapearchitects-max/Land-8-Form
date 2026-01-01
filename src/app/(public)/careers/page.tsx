import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Briefcase, Users, Target, Heart, Clock, Award, MapPin } from 'lucide-react';
import { getHiringStatus, getJobPositions } from '@/lib/queries';

export const metadata: Metadata = {
    title: 'Careers | LAND 8 FORM',
    description: 'Join our team of talented architects and designers. Explore career opportunities at LAND 8 FORM',
};

const benefits = [
    {
        icon: <Briefcase size={24} />,
        title: 'Creative Freedom',
        description: 'We encourage innovative thinking and give our team the freedom to explore new ideas.',
    },
    {
        icon: <Target size={24} />,
        title: 'Professional Growth',
        description: 'Continuous learning opportunities, mentorship, and career advancement paths.',
    },
    {
        icon: <Users size={24} />,
        title: 'Impactful Projects',
        description: 'Work on meaningful projects that shape communities and create lasting impacts.',
    },
    {
        icon: <Heart size={24} />,
        title: 'Collaborative Culture',
        description: 'Join a diverse team where collaboration and open communication are core values.',
    },
    {
        icon: <Clock size={24} />,
        title: 'Work-Life Balance',
        description: 'Flexible working arrangements and a supportive environment that values your wellbeing.',
    },
    {
        icon: <Award size={24} />,
        title: 'Competitive Benefits',
        description: 'Comprehensive benefits including health insurance and professional development funds.',
    },
];

export default async function CareersPage() {
    const [hiringStatus, jobPositions] = await Promise.all([
        getHiringStatus(),
        getJobPositions(),
    ]);

    const isHiring = hiringStatus?.is_hiring ?? false;

    return (
        <div className="pt-20 min-h-[80vh]">
            {/* Header */}
            <section className="section pb-0">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
                            Build Your Future With Us
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                            We&apos;re looking for passionate individuals who want to make a difference in the world of architecture.
                        </p>
                    </div>
                </div>
            </section>

            {/* Hiring Status Banner */}
            <section className="section pt-0">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className={`glass p-8 rounded-2xl text-center ${isHiring ? 'border-2 border-green-500' : 'border border-[var(--glass-border)]'}`}>
                            {isHiring ? (
                                <>
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Briefcase size={32} className="text-green-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                        {hiringStatus?.hiring_title || "We're Hiring!"}
                                    </h2>
                                    <p className="text-[var(--text-secondary)] mb-6">
                                        {hiringStatus?.hiring_description || "We're hiring! If you're passionate about architecture and design, we'd love to hear from you."}
                                    </p>
                                    <Link href="/contact" className="btn-primary">
                                        Contact Us
                                        <ArrowRight size={18} />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--primary-accent)]/20 flex items-center justify-center">
                                        <Briefcase size={32} className="text-[var(--primary-accent)]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                        {hiringStatus?.not_hiring_title || 'We Are Not Currently Hiring'}
                                    </h2>
                                    <p className="text-[var(--text-secondary)]">
                                        {hiringStatus?.not_hiring_description || 'Please check back later for opportunities.'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Positions - Only shown when hiring is enabled */}
            {isHiring && jobPositions.length > 0 && (
                <section className="section">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif" }}>
                                Open Positions
                            </h2>
                            <p className="text-[var(--text-secondary)]">Explore our current job openings and find your perfect role.</p>
                        </div>

                        <div className="space-y-6 max-w-4xl mx-auto">
                            {jobPositions.map((position) => (
                                <div
                                    key={position.id}
                                    className="glass rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                        <div className="flex-1">
                                            {/* Job Title */}
                                            <h3
                                                className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3"
                                                style={{ fontFamily: "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif" }}
                                            >
                                                {position.title}
                                            </h3>

                                            {/* Description */}
                                            {position.description && (
                                                <p
                                                    className="text-[var(--text-secondary)] text-sm md:text-base mb-4 leading-relaxed"
                                                    style={{ fontFamily: "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif" }}
                                                >
                                                    {position.description}
                                                </p>
                                            )}

                                            {/* Location & Type */}
                                            <div className="flex flex-wrap items-center gap-4 md:gap-8">
                                                {position.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={16} className="text-[var(--primary-accent)]" />
                                                        <span
                                                            className="text-[var(--primary-accent)] font-medium text-sm"
                                                            style={{ fontFamily: "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif" }}
                                                        >
                                                            {position.location}
                                                        </span>
                                                    </div>
                                                )}
                                                <span
                                                    className="text-[var(--primary-accent)] font-medium text-sm"
                                                    style={{ fontFamily: "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif" }}
                                                >
                                                    {position.job_type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Apply Button */}
                                        <div className="flex-shrink-0">
                                            <Link
                                                href="/contact"
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--primary-accent)] hover:bg-[var(--primary-accent-hover)] text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                                                style={{ fontFamily: "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif" }}
                                            >
                                                Apply
                                                <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Why Join Us */}
            <section className="section bg-[var(--background-secondary)]">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="section-title centered text-center mx-auto">
                            Why Join LAND 8 FORM?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="card p-6 text-center">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--primary-accent)]/20 flex items-center justify-center text-[var(--primary-accent)]">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-[var(--text-secondary)] text-sm">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* General Inquiries (only show when hiring) */}
            {isHiring && (
                <section className="section">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="glass p-8 rounded-2xl">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                                    Ready to Join Our Team?
                                </h3>
                                <p className="text-[var(--text-secondary)] mb-6">
                                    Send us your portfolio and resume. We&apos;re excited to learn more about you!
                                </p>
                                <Link href="/contact" className="btn-secondary">
                                    Get in Touch
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
