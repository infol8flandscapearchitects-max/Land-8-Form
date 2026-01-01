import { MetadataRoute } from 'next'

// IMPORTANT: Replace this with your actual production domain
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://land8form.com'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        sitemap: ${BASE_URL}/sitemap.xml,
    }
}
