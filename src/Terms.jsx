import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div className="min-h-screen bg-brand-offwhite p-10 font-sans text-black">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 mb-10 text-gray-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={20} />
                    back to home
                </Link>

                <h1 className="text-5xl font-black mb-8">terms of service</h1>

                <div className="space-y-6 text-gray-600 leading-relaxed font-medium">
                    <p>last updated: december 2025</p>

                    <h2 className="text-2xl font-bold text-black mt-8">1. acceptance of terms</h2>
                    <p>
                        by using the fitting room, you agree to these terms. if you do not agree, please do not use our app.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">2. service provided</h2>
                    <p>
                        the fitting room provides a virtual try-on experience powered by artificial intelligence (google gemini). we do not guarantee the accuracy
                        or realism of the generated images. the results are for entertainment and visualization purposes only.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">3. user responsibility</h2>
                    <p>
                        you are responsible for the photos you upload. by uploading a photo, you confirm that you have the right to use it.
                        you must not upload illegal, offensive, or inappropriate content.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">4. data & privacy</h2>
                    <p>
                        as outlined in our privacy policy, we do not store your photos. they are processed by the google gemini api and then returned to your device.
                        you retain all rights to your original content.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">5. disclaimers</h2>
                    <p>
                        the service is provided "as is" without warranties of any kind. we are not liable for any damages arising from your use of the app.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
