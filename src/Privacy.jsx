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
                    <p>last updated: december 2025</p>

                    <h2 className="text-2xl font-bold text-black mt-8">1. no data collection</h2>
                    <p>
                        we believe in complete privacy. we do not collect, store, or share your personal information. we do not require you to create an account,
                        and we do not ask for your name, email, or any other private details.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">2. how your photos are used</h2>
                    <p>
                        when you upload a photo to use the virtual try-on feature:
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li>your photos are sent directly to the google gemini api for processing.</li>
                            <li>once processed, the result is returned to your device.</li>
                            <li>we do not store your photos on our servers.</li>
                            <li>your photos remain stored locally on your own device.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">3. third-party processing</h2>
                    <p>
                        we use google gemini to power our virtual try-on technology. by using our service, you acknowledge that your images will be processed by google's AI based on their
                        <a href="https://policies.google.com/privacy" className="underline hover:text-black ml-1" target="_blank" rel="noopener noreferrer">privacy policy</a>.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">4. contact us</h2>
                    <p>
                        if you have any questions about this privacy policy, please contact us at <a href="mailto:denis.gavriloff@gmail.com" className="font-bold underline">denis.gavriloff@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div >
    );
};

export default Privacy;
