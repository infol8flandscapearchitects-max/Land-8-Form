'use client';

import { motion } from 'framer-motion';

type ProjectStatus = 'upcoming' | 'ongoing' | 'completed';

interface StatusFilterProps {
    selectedStatus: ProjectStatus | null;
    onSelectStatus: (status: ProjectStatus | null) => void;
}

const statuses: { value: ProjectStatus; label: string }[] = [
    { value: 'completed', label: 'Completed' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'upcoming', label: 'Upcoming' },
];

export default function StatusFilter({
    selectedStatus,
    onSelectStatus,
}: StatusFilterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 flex-wrap"
        >
            <span className="text-[var(--text-secondary)] text-sm font-medium mr-2">
                Status:
            </span>

            {/* All Status */}
            <button
                onClick={() => onSelectStatus(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${selectedStatus === null
                    ? 'bg-[var(--primary-accent)]/20 text-[var(--primary-accent)] border border-[var(--primary-accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--glass-border)]'
                    }`}
            >
                All
            </button>

            {/* Status Buttons */}
            {statuses.map((status) => (
                <button
                    key={status.value}
                    onClick={() => onSelectStatus(status.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${selectedStatus === status.value
                        ? status.value === 'upcoming'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500'
                            : status.value === 'ongoing'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                                : 'bg-green-500/20 text-green-400 border border-green-500'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--glass-border)]'
                        }`}
                >
                    {status.label}
                </button>
            ))}
        </motion.div>
    );
}
