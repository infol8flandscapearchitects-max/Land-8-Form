import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

// IMPORTANT: Replace this with your actual production domain
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://land8form.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: ${BASE_URL}/about,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: ${BASE_URL}/projects,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: ${BASE_URL}/staff,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: ${BASE_URL}/careers,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: ${BASE_URL}/contact,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]

    // Dynamic project pages
    let projectPages: MetadataRoute.Sitemap = []

    try {
        const supabase = await createClient()
        const { data: projects } = await supabase
            .from('projects')
            .select('id, updated_at')
            .order('created_at', { ascending: false })

        if (projects && projects.length > 0) {
            projectPages = projects.map((project: { id: string; updated_at: string | null }) => ({
                url: ${BASE_URL}/projects/${project.id},
                lastModified: new Date(project.updated_at || new Date()),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            }))
        }
    } catch (error) {
        console.error('Error fetching projects for sitemap:', error)
    }

    return [...staticPages, ...projectPages]
}
