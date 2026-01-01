'use client';

import { useState, useEffect } from 'react';
import { getContactInfo, updateContactInfo } from '@/lib/actions/contact';
import { ContactInfo } from '@/lib/types/database';
import { Save, ArrowLeft, Phone, Mail, MapPin, Link as LinkIcon, Linkedin, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

// Custom Pinterest icon
const PinterestIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345c-.091.378-.293 1.194-.332 1.361-.053.218-.174.265-.402.16-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378 0 0-.602 2.291-.748 2.853-.271 1.042-1.002 2.349-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
);

export default function ContactInfoSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        phone_number: '',
        telephone_number: '',
        address: '',
        google_maps_url: '',
        linkedin_url: '',
        instagram_url: '',
        youtube_url: '',
        pinterest_url: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getContactInfo();
        if (data) {
            setFormData({
                email: data.email || '',
                phone_number: data.phone_number || '',
                telephone_number: data.telephone_number || '',
                address: data.address || '',
                google_maps_url: data.google_maps_url || '',
                linkedin_url: data.linkedin_url || '',
                instagram_url: data.instagram_url || '',
                youtube_url: data.youtube_url || '',
                pinterest_url: data.pinterest_url || '',
            });
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = await updateContactInfo({
            email: formData.email || null,
            phone_number: formData.phone_number || null,
            telephone_number: formData.telephone_number || null,
            address: formData.address || null,
            google_maps_url: formData.google_maps_url || null,
            linkedin_url: formData.linkedin_url || null,
            instagram_url: formData.instagram_url || null,
            youtube_url: formData.youtube_url || null,
            pinterest_url: formData.pinterest_url || null,
        });

        if (result.success) {
            toast.success('Contact info saved successfully!');
        } else {
            toast.error(result.error || 'Failed to save contact info');
        }
        setIsSaving(false);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div>
                <div className="page-header">
                    <div className="skeleton" style={{ height: '32px', width: '200px', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '20px', width: '300px' }} />
                </div>
                <div className="admin-card">
                    <div className="skeleton" style={{ height: '400px' }} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '16px' }}>
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </Link>
                    <h1 className="page-title">Contact Info Settings</h1>
                    <p className="page-description">Manage your contact details and social media links.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Contact Details Section */}
                <div className="admin-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Contact Details</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={16} style={{ color: 'var(--admin-accent)' }} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="info@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={16} style={{ color: 'var(--admin-accent)' }} />
                                Primary Phone
                            </label>
                            <input
                                type="tel"
                                className="form-input"
                                value={formData.phone_number}
                                onChange={(e) => handleChange('phone_number', e.target.value)}
                                placeholder="+91 9999999999"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={16} style={{ color: 'var(--admin-accent)' }} />
                                Secondary Phone / Telephone
                            </label>
                            <input
                                type="tel"
                                className="form-input"
                                value={formData.telephone_number}
                                onChange={(e) => handleChange('telephone_number', e.target.value)}
                                placeholder="Landline or alternate number"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LinkIcon size={16} style={{ color: 'var(--admin-accent)' }} />
                                Google Maps URL
                            </label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.google_maps_url}
                                onChange={(e) => handleChange('google_maps_url', e.target.value)}
                                placeholder="https://maps.google.com/..."
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={16} style={{ color: 'var(--admin-accent)' }} />
                                Office Address
                            </label>
                            <textarea
                                className="form-input"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="Enter your complete office address"
                                rows={3}
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links Section */}
                <div className="admin-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Social Media Links</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Linkedin size={16} style={{ color: '#0077b5' }} />
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.linkedin_url}
                                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                                placeholder="https://linkedin.com/company/..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Instagram size={16} style={{ color: '#E4405F' }} />
                                Instagram
                            </label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.instagram_url}
                                onChange={(e) => handleChange('instagram_url', e.target.value)}
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Youtube size={16} style={{ color: '#FF0000' }} />
                                YouTube
                            </label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.youtube_url}
                                onChange={(e) => handleChange('youtube_url', e.target.value)}
                                placeholder="https://youtube.com/channel/..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PinterestIcon size={16} />
                                <span style={{ color: '#E60023' }}>Pinterest</span>
                            </label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.pinterest_url}
                                onChange={(e) => handleChange('pinterest_url', e.target.value)}
                                placeholder="https://pinterest.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <span className="spinner" style={{ width: '18px', height: '18px' }} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
