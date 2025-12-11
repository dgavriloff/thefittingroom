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

                    <h2 className="text-2xl font-bold text-black mt-8">1. introduction</h2>
                    <p>
                        welcome to the fitting room ("we," "our," or "us"). we respect your privacy and are committed to protecting your personal data.
                        this privacy policy will inform you as to how we look after your personal data when you visit our website or use our application
                        and tell you about your privacy rights and how the law protects you.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">2. data we collect</h2>
                    <p>
                        we may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li>identity data: includes first name, last name, username or similar identifier.</li>
                            <li>biometric data: includes body measurements and photos you upload for the virtual try-on feature.</li>
                            <li>usage data: includes information about how you use our website, products and services.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">3. how we use your data</h2>
                    <p>
                        we will only use your personal data when the law allows us to. most commonly, we will use your personal data in the following circumstances:
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li>to provide the virtual try-on service.</li>
                            <li>to manage your account.</li>
                            <li>to improve our website and services.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">4. data security</h2>
                    <p>
                        we have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">5. contact us</h2>
                    <p>
                        if you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:denis.gavriloff@gmail.com" className="font-bold underline">denis.gavriloff@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div >
    );
};

export default Privacy;
