import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';
import SplashScreen from '@/components/layout/SplashScreen';
import ThemeProvider from '@/components/layout/ThemeProvider';
import { getLogoAndName, getContactInfo, getSiteSettings } from '@/lib/queries';

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch data from Supabase including site settings for colors/typography
    const [logoAndName, contactInfo, siteSettings] = await Promise.all([
        getLogoAndName(),
        getContactInfo(),
        getSiteSettings(),
    ]);

    return (
        <ThemeProvider
            backgroundColor={siteSettings?.background_color}
            primaryAccentColor={siteSettings?.primary_accent_color}
            textColor={siteSettings?.text_color}
            secondaryTextColor={siteSettings?.secondary_text_color}
            fontFamily={siteSettings?.font_family}
        >
            <div className="public-layout">
                <SplashScreen
                    companyNameColor={logoAndName?.company_name_color || "#D4782C"}
                    duration={7000}
                />
                <Header
                    companyName={logoAndName?.company_name || "LAND 8 FORM"}
                    companyNameColor={logoAndName?.company_name_color || "#CC5500"}
                    logoUrl={logoAndName?.logo_url}
                />
                <main className="min-h-screen pt-0">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
                <Footer
                    logoUrl={logoAndName?.logo_url}
                    companyName={logoAndName?.company_name || "LAND 8 FORM"}
                    companyNameColor={logoAndName?.company_name_color || "#CC5500"}
                    contactInfo={{
                        linkedin_url: contactInfo?.linkedin_url || null,
                        instagram_url: contactInfo?.instagram_url || null,
                        youtube_url: contactInfo?.youtube_url || null,
                        pinterest_url: contactInfo?.pinterest_url || null,
                        email: contactInfo?.email || 'info.l8flandscapearchitects@gmail.com',
                        phone: contactInfo?.phone_number || '+91 9948586888',
                        telephone: contactInfo?.telephone_number || null,
                        address: contactInfo?.address || '867, Road:45, CBI Colony, Jubilee Hills, Hyderabad, Telangana 500033',
                        map_url: contactInfo?.google_maps_url || null,
                    }}
                />
            </div>
        </ThemeProvider>
    );
}
