'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, FolderCheck, Calendar, Save, Loader2 } from 'lucide-react';
import { getSiteStats, updateSiteStats } from '@/lib/actions/stats';

interface SiteStats {
    id: string;
    total_projects: number;
    team_members: number;
    completed_projects: number;
    years_of_experience: number;
}

export default function StatsManagementPage() {
    const [stats, setStats] = useState<SiteStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form state
    const [totalProjects, setTotalProjects] = useState(0);
    const [teamMembers, setTeamMembers] = useState(0);
    const [completedProjects, setCompletedProjects] = useState(0);
    const [yearsOfExperience, setYearsOfExperience] = useState(0);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await getSiteStats();
            if (data) {
                setStats(data);
                setTotalProjects(data.total_projects);
                setTeamMembers(data.team_members);
                setCompletedProjects(data.completed_projects);
                setYearsOfExperience(data.years_of_experience);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            setMessage({ type: 'error', text: 'Failed to load statistics' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const result = await updateSiteStats({
                total_projects: totalProjects,
                team_members: teamMembers,
                completed_projects: completedProjects,
                years_of_experience: yearsOfExperience,
            });

            if (result.success) {
                setMessage({ type: 'success', text: 'Statistics updated successfully! Changes will be reflected on the About page.' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update statistics' });
            }
        } catch (error) {
            console.error('Error updating stats:', error);
            setMessage({ type: 'error', text: 'An error occurred while updating statistics' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-accent)]" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Site Statistics</h1>
                <p className="text-gray-400">
                    Manage the statistics displayed on the About page. These numbers can be manually updated to reflect your company&apos;s achievements.
                </p>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                        : 'bg-red-500/20 border border-red-500/50 text-red-400'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Stats Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Projects */}
                    <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/10 hover:border-[var(--primary-accent)]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Total Projects</h3>
                                <p className="text-gray-400 text-sm">Number of projects your company has worked on</p>
                            </div>
                        </div>
                        <input
                            type="number"
                            min="0"
                            value={totalProjects}
                            onChange={(e) => setTotalProjects(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-2xl font-bold focus:outline-none focus:border-[var(--primary-accent)] transition-colors"
                        />
                    </div>

                    {/* Team Members */}
                    <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/10 hover:border-[var(--primary-accent)]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Users className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Team Members</h3>
                                <p className="text-gray-400 text-sm">Total number of team members in your company</p>
                            </div>
                        </div>
                        <input
                            type="number"
                            min="0"
                            value={teamMembers}
                            onChange={(e) => setTeamMembers(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-2xl font-bold focus:outline-none focus:border-[var(--primary-accent)] transition-colors"
                        />
                    </div>

                    {/* Completed Projects */}
                    <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/10 hover:border-[var(--primary-accent)]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <FolderCheck className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Completed Projects</h3>
                                <p className="text-gray-400 text-sm">Number of successfully completed projects</p>
                            </div>
                        </div>
                        <input
                            type="number"
                            min="0"
                            value={completedProjects}
                            onChange={(e) => setCompletedProjects(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-2xl font-bold focus:outline-none focus:border-[var(--primary-accent)] transition-colors"
                        />
                    </div>

                    {/* Office Journey */}
                    <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/10 hover:border-[var(--primary-accent)]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Office Journey</h3>
                                <p className="text-gray-400 text-sm">How many years your company has been in business</p>
                            </div>
                        </div>
                        <input
                            type="number"
                            min="0"
                            value={yearsOfExperience}
                            onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-2xl font-bold focus:outline-none focus:border-[var(--primary-accent)] transition-colors"
                        />
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[var(--primary-accent)] rounded-full"></span>
                        Preview (How it will appear on About page)
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
                            <div className="text-2xl md:text-3xl font-bold text-[var(--primary-accent)]">{totalProjects}+</div>
                            <div className="text-gray-400 text-sm">Total Projects</div>
                        </div>
                        <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
                            <div className="text-2xl md:text-3xl font-bold text-[var(--primary-accent)]">{teamMembers}</div>
                            <div className="text-gray-400 text-sm">Team Members</div>
                        </div>
                        <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
                            <div className="text-2xl md:text-3xl font-bold text-[var(--primary-accent)]">{completedProjects}+</div>
                            <div className="text-gray-400 text-sm">Completed Projects</div>
                        </div>
                        <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
                            <div className="text-2xl md:text-3xl font-bold text-[var(--primary-accent)]">{yearsOfExperience}+</div>
                            <div className="text-gray-400 text-sm">Office Journey</div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Statistics
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Info Card */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-blue-400 font-semibold mb-2">ℹ️ How it works</h3>
                <ul className="text-gray-400 space-y-2 text-sm">
                    <li>• These statistics are displayed in the &quot;Stats Section&quot; on the About page.</li>
                    <li>• Changes are saved to the database and immediately reflected on the public website.</li>
                    <li>• The values are fully customizable and not automatically calculated from other data.</li>
                    <li>• You can update these numbers anytime to keep your website current.</li>
                </ul>
            </div>
        </div>
    );
}
