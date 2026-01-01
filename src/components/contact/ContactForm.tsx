'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitContactForm } from '@/lib/actions/contact';

export default function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            const result = await submitContactForm({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                alternative_phone: null,
                subject: formData.subject,
                message: formData.message,
            });

            if (result.success) {
                toast.success("Message sent successfully! We'll get back to you soon.");
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                toast.error(result.error || 'Failed to send message');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Your name"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="your@email.com"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Phone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Subject *
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="How can we help?"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Message *
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="form-input resize-none"
                    placeholder="Tell us about your project..."
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send size={18} />
                        Send Message
                    </>
                )}
            </button>
        </form>
    );
}
