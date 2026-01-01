import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Public site colors
                background: 'var(--background)',
                'background-secondary': 'var(--background-secondary)',
                'primary-accent': 'var(--primary-accent)',
                'primary-accent-hover': 'var(--primary-accent-hover)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                // Admin colors
                'admin-bg': 'var(--admin-bg)',
                'admin-bg-secondary': 'var(--admin-bg-secondary)',
                'admin-accent': 'var(--admin-accent)',
                'admin-text': 'var(--admin-text)',
                'admin-border': 'var(--admin-border)',
            },
            fontFamily: {
                sans: ['Arial Rounded MT Bold', 'Nunito', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(100%)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
}

export default config
