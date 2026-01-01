'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Linkedin, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { ContactInfo } from '@/lib/types/database';

// Custom Pinterest icon component since lucide-react doesn't have one
const PinterestIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345c-.091.378-.293 1.194-.332 1.361-.053.218-.174.265-.402.16-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378 0 0-.602 2.291-.748 2.853-.271 1.042-1.002 2.349-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
);

interface ContactInfoProps {
    data: ContactInfo | null;
}

// Function to generate Google Maps embed URL from various Google Maps URL formats
function getGoogleMapsEmbedUrl(url: string | null | undefined, address: string | null | undefined): string {
    // Default location: LAND 8 FORM headquarters in Jubilee Hills, Hyderabad
    const defaultAddress = '867, Road:45, CBI Colony, Jubilee Hills, Hyderabad, Telangana 500033';

    if (url) {
        // If it's already an embed URL, return it
        if (url.includes('google.com/maps/embed') || url.includes('maps.google.com/maps?')) {
            return url;
        }

        // Try to extract place or coordinates from Google Maps URL
        try {
            // Check for place in path
            if (url.includes('/place/')) {
                const placeMatch = url.match(/\/place\/([^\/\?@]+)/);
                if (placeMatch) {
                    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
                    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                }
            }

            // Check for coordinates in @lat,lng format
            const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (coordMatch) {
                const lat = coordMatch[1];
                const lng = coordMatch[2];
                return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
            }

            // Check for query parameter
            const urlObj = new URL(url);
            const query = urlObj.searchParams.get('q');
            if (query) {
                return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
            }
        } catch (e) {
            // URL parsing failed, fall back to address
        }
    }

    // Fallback: Use address for embed (no API key required)
    const searchAddress = address || defaultAddress;
    return `https://maps.google.com/maps?q=${encodeURIComponent(searchAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}


export default function ContactInfoDisplay({ data }: ContactInfoProps) {
    const contact = data || {
        email: 'info.l8flandscapearchitects@gmail.com',
        phone_number: '+91 9948586888',
        address: '867, Road:45, CBI Colony, Jubilee Hills, Hyderabad, Telangana 500033',
        google_maps_url: null,
    };

    // Build social links array
    const socialLinks = [
        { icon: Linkedin, url: data?.linkedin_url, label: 'LinkedIn', color: '#0077b5' },
        { icon: Instagram, url: data?.instagram_url, label: 'Instagram', color: '#E4405F' },
        { icon: Youtube, url: data?.youtube_url, label: 'YouTube', color: '#FF0000' },
        { icon: PinterestIcon, url: data?.pinterest_url, label: 'Pinterest', color: '#E60023' },
    ].filter(link => link.url);

    // Get embedded map URL
    const mapEmbedUrl = getGoogleMapsEmbedUrl(data?.google_maps_url, contact.address);
    const mapLinkUrl = data?.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address || '')}`;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
                Get in Touch
            </h2>

            <div className="space-y-6">
                {contact.phone_number && (
                    <a
                        href={`tel:${contact.phone_number}`}
                        className="flex items-start gap-4 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[var(--primary-accent)]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary-accent)] transition-colors">
                            <Phone size={20} className="text-[var(--primary-accent)] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)] mb-1">Phone</p>
                            <p className="text-[var(--text-primary)] font-medium group-hover:text-[var(--primary-accent)] transition-colors">
                                {contact.phone_number}
                            </p>
                        </div>
                    </a>
                )}

                {contact.email && (
                    <a
                        href={`mailto:${contact.email}`}
                        className="flex items-start gap-4 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[var(--primary-accent)]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary-accent)] transition-colors">
                            <Mail size={20} className="text-[var(--primary-accent)] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)] mb-1">Email</p>
                            <p className="text-[var(--text-primary)] font-medium group-hover:text-[var(--primary-accent)] transition-colors">
                                {contact.email}
                            </p>
                        </div>
                    </a>
                )}

                {contact.address && (
                    <a
                        href={mapLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[var(--primary-accent)]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary-accent)] transition-colors">
                            <MapPin size={20} className="text-[var(--primary-accent)] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-secondary)] mb-1">Address</p>
                            <p className="text-[var(--text-primary)] font-medium group-hover:text-[var(--primary-accent)] transition-colors">
                                {contact.address}
                            </p>
                        </div>
                    </a>
                )}
            </div>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                        Follow Us
                    </h3>
                    <div className="flex items-center gap-3">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.url!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl bg-[var(--background-secondary)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary-accent)] hover:border-[var(--primary-accent)] hover:scale-110 transition-all duration-300"
                                aria-label={link.label}
                            >
                                <link.icon size={22} />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Embedded Google Maps */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Our Location
                    </h3>

                </div>
                <a
                    href={mapLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-video rounded-2xl overflow-hidden bg-[var(--background-secondary)] border border-[var(--glass-border)] relative group cursor-pointer"
                    title="Click to open in Google Maps"
                >
                    <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, pointerEvents: 'none' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Office Location Map"
                        className="absolute inset-0 w-full h-full"
                    />
                    {/* Clickable Overlay */}
                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[var(--primary-accent)] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                            <MapPin size={18} />
                            <span className="font-medium">Open in Google Maps</span>
                            <ExternalLink size={14} />
                        </div>
                    </div>
                </a>
            </div>
        </motion.div>
    );
}
