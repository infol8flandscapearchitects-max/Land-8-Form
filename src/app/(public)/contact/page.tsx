import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfoDisplay from '@/components/contact/ContactInfo';
import { getContactInfo } from '@/lib/queries';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
    title: 'Contact Us | LAND 8 FORM',
    description: 'Get in touch with LAND 8 FORM for your architectural needs. We\'d love to hear about your project.',
};

export default async function ContactPage() {
    const contactInfo = await getContactInfo();

    return (
        <div className="pt-20">
            <Toaster position="top-right" />

            {/* Header */}
            <section className="section pb-0">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
                            Contact Us
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                            Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form and Info */}
            <section className="section">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Contact Info */}
                        <div className="order-1 lg:order-1">
                            <ContactInfoDisplay data={contactInfo} />
                        </div>

                        {/* Contact Form */}
                        <div className="order-2 lg:order-2">
                            <div className="glass p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                                    Send Us a Message
                                </h2>
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
