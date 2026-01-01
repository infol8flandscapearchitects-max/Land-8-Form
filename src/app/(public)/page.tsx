import HeroSlideshow from '@/components/home/HeroSlideshow';
import CeoSection from '@/components/home/CeoSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import LearnMore from '@/components/home/LearnMore';
import {
    getHeroSlides,
    getCeoSection,
    getFeaturedProjects,
    getLearnMoreSection,
} from '@/lib/queries';

export default async function HomePage() {
    // Fetch data from Supabase
    const [heroSlides, ceoSection, featuredProjects, learnMoreSection] = await Promise.all([
        getHeroSlides(),
        getCeoSection(),
        getFeaturedProjects(),
        getLearnMoreSection(),
    ]);

    return (
        <>
            {/* Hero Slideshow */}
            <HeroSlideshow slides={heroSlides} />

            {/* CEO Introduction */}
            <CeoSection data={ceoSection} />

            {/* Featured Projects */}
            <FeaturedProjects projects={featuredProjects} />

            {/* Learn More About Us */}
            <LearnMore data={learnMoreSection} />
        </>
    );
}
