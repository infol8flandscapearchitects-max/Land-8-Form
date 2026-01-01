'use client';

import { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSettings, getLogoAndName, updateLogoAndName } from '@/lib/actions/site-settings';
import { uploadImage } from '@/lib/actions/storage';
import { SiteSettings, LogoAndName } from '@/lib/types/database';
import { Palette, Type, Upload, Save, Image as ImageIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [logoData, setLogoData] = useState<LogoAndName | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [settingsData, logo] = await Promise.all([
            getSiteSettings(),
            getLogoAndName(),
        ]);
        setSettings(settingsData);
        setLogoData(logo);
        setIsLoading(false);
    };

    const handleSettingsChange = (field: keyof SiteSettings, value: string) => {
        if (settings) {
            setSettings({ ...settings, [field]: value });
        }
    };

    const handleLogoDataChange = (field: keyof LogoAndName, value: string) => {
        if (logoData) {
            setLogoData({ ...logoData, [field]: value });
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const base64 = await new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result as string);
            r.readAsDataURL(file);
        });

        const result = await uploadImage(base64, file.name, 'logos', file.type);
        if (result.success && result.url) {
            handleLogoDataChange('logo_url', result.url);
            toast.success('Logo uploaded successfully!');
        } else {
            console.error('Logo upload failed:', result.error);
            toast.error(result.error || 'Failed to upload logo');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            if (settings) {
                const settingsResult = await updateSiteSettings({
                    background_color: settings.background_color,
                    primary_accent_color: settings.primary_accent_color,
                    text_color: settings.text_color,
                    secondary_text_color: settings.secondary_text_color,
                    font_family: settings.font_family,
                });

                if (!settingsResult.success) {
                    throw new Error(settingsResult.error);
                }
            }

            if (logoData) {
                const logoResult = await updateLogoAndName({
                    logo_url: logoData.logo_url,
                    company_name: logoData.company_name,
                    company_name_color: logoData.company_name_color,
                });

                if (!logoResult.success) {
                    throw new Error(logoResult.error);
                }
            }

            toast.success('Settings saved successfully!');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div>
                <Toaster position="top-right" />
                <div className="page-header">
                    <h1 className="page-title">Site Settings</h1>
                    <p className="page-description">Customize your website&apos;s appearance and branding.</p>
                </div>
                <div className="grid-2">
                    <div className="admin-card skeleton" style={{ height: '400px' }} />
                    <div className="admin-card skeleton" style={{ height: '400px' }} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header">
                <h1 className="page-title">Site Settings</h1>
                <p className="page-description">Customize your website&apos;s appearance and branding.</p>
            </div>

            <div className="grid-2">
                {/* Logo & Branding */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            <ImageIcon size={20} style={{ marginRight: '8px' }} />
                            Logo & Branding
                        </h2>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Company Logo</label>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '24px',
                            background: 'var(--admin-bg)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '12px'
                        }}>
                            {(logoPreview || logoData?.logo_url) && (
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--admin-border)'
                                }}>
                                    <img
                                        src={logoPreview || logoData?.logo_url}
                                        alt="Logo"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            )}
                            <label style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: 'var(--admin-bg-tertiary)',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '8px',
                                color: 'var(--admin-text-secondary)',
                                fontSize: '0.875rem',
                                cursor: 'pointer'
                            }}>
                                <Upload size={18} />
                                <span>Upload Logo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={logoData?.company_name || ''}
                            onChange={(e) => handleLogoDataChange('company_name', e.target.value)}
                            placeholder="Your Company Name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Company Name Color</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="color"
                                className="form-color"
                                value={logoData?.company_name_color || '#CC5500'}
                                onChange={(e) => handleLogoDataChange('company_name_color', e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1 }}
                                value={logoData?.company_name_color || '#CC5500'}
                                onChange={(e) => handleLogoDataChange('company_name_color', e.target.value)}
                                placeholder="#CC5500"
                            />
                        </div>
                    </div>
                </div>

                {/* Colors & Typography */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            <Palette size={20} style={{ marginRight: '8px' }} />
                            Colors & Typography
                        </h2>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Background Color</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="color"
                                className="form-color"
                                value={settings?.background_color || '#2D2D2D'}
                                onChange={(e) => handleSettingsChange('background_color', e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1 }}
                                value={settings?.background_color || '#2D2D2D'}
                                onChange={(e) => handleSettingsChange('background_color', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Primary Accent Color</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="color"
                                className="form-color"
                                value={settings?.primary_accent_color || '#FF8C42'}
                                onChange={(e) => handleSettingsChange('primary_accent_color', e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1 }}
                                value={settings?.primary_accent_color || '#FF8C42'}
                                onChange={(e) => handleSettingsChange('primary_accent_color', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Text Color</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="color"
                                className="form-color"
                                value={settings?.text_color || '#FFFFFF'}
                                onChange={(e) => handleSettingsChange('text_color', e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1 }}
                                value={settings?.text_color || '#FFFFFF'}
                                onChange={(e) => handleSettingsChange('text_color', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Secondary Text Color</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="color"
                                className="form-color"
                                value={settings?.secondary_text_color || '#CCCCCC'}
                                onChange={(e) => handleSettingsChange('secondary_text_color', e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1 }}
                                value={settings?.secondary_text_color || '#CCCCCC'}
                                onChange={(e) => handleSettingsChange('secondary_text_color', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Type size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            Font Family
                        </label>
                        <select
                            className="form-select"
                            value={settings?.font_family || 'Arial Rounded MT Bold'}
                            onChange={(e) => handleSettingsChange('font_family', e.target.value)}
                        >
                            <option value="Arial Rounded MT Bold">Arial Rounded MT Bold</option>
                            <option value="Inter">Inter</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Poppins">Poppins</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <span className="spinner" />
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
        </div>
    );
}
