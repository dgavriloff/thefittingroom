import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-brand-offwhite p-10 font-sans text-black">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 mb-10 text-gray-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={20} />
                    back to home
                </Link>

                <h1 className="text-5xl font-black mb-8">privacy policy</h1>

                <div className="space-y-6 text-gray-600 leading-relaxed font-medium">
                    <p>last updated: february 2026</p>

                    <h2 className="text-2xl font-bold text-black mt-8">1. information we collect</h2>
                    <p>
                        we collect minimal information to operate the app:
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li>a randomly generated device identifier, stored securely on your device. this is used to track your generation quota and purchases. it is not linked to your personal identity.</li>
                            <li>generation usage counts, stored on our servers to manage free and paid tiers.</li>
                            <li>purchase and subscription status, processed through revenuecat (our payment infrastructure provider) and apple's app store.</li>
                        </ul>
                    </p>
                    <p>
                        we do not collect your name, email address, phone number, or any other personally identifiable information. we do not require you to create an account.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">2. how your photos are used</h2>
                    <p>
                        when you upload a photo to use the virtual try-on feature:
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li>your photos are sent to our server, which forwards them to the google gemini api for processing.</li>
                            <li>once processed, the result is returned to your device.</li>
                            <li>we do not store your photos on our servers. they are transmitted for processing only and are not retained.</li>
                            <li>your photos remain stored locally on your own device.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">3. third-party services</h2>
                    <p>
                        we use the following third-party services:
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li><strong>google gemini</strong> — powers our virtual try-on AI. your images are processed according to google's
                                <a href="https://policies.google.com/privacy" className="underline hover:text-black ml-1" target="_blank" rel="noopener noreferrer">privacy policy</a>.</li>
                            <li><strong>revenuecat</strong> — manages in-app purchases and subscriptions. see their
                                <a href="https://www.revenuecat.com/privacy" className="underline hover:text-black ml-1" target="_blank" rel="noopener noreferrer">privacy policy</a>.</li>
                            <li><strong>upstash</strong> — securely stores generation counts and quota data.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">4. data retention</h2>
                    <p>
                        device identifiers and usage counts are retained as long as they are needed to provide the service. subscription usage data expires automatically after 45 days. we do not sell or share your data with third parties for advertising purposes.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">5. contact us</h2>
                    <p>
                        if you have any questions about this privacy policy, please contact us at <a href="mailto:denis.gavriloff@gmail.com" className="font-bold underline">denis.gavriloff@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div >
    );
};

export default Privacy;
