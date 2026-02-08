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
                    <p>last updated: february 2026</p>

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

                    <h2 className="text-2xl font-bold text-black mt-8">4. purchases & subscriptions</h2>
                    <p>
                        the fitting room offers in-app purchases including credit packs and a monthly subscription, processed through apple's app store.
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li><strong>free tier:</strong> new users receive 5 free generations.</li>
                            <li><strong>credit packs:</strong> one-time purchases that add generations to your account. credits do not expire.</li>
                            <li><strong>pro subscription:</strong> a monthly auto-renewable subscription that provides unlimited generations and access to the pro model. the subscription automatically renews each month unless cancelled at least 24 hours before the end of the current billing period.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">5. payment & cancellation</h2>
                    <p>
                        all payments are processed by apple through your app store account. prices are displayed in your local currency at the time of purchase.
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li>subscriptions can be managed and cancelled in your device's settings under subscriptions.</li>
                            <li>cancellation takes effect at the end of the current billing period. you will retain access until then.</li>
                            <li>refunds are handled by apple according to their refund policy.</li>
                            <li>unused free generations and purchased credits are non-refundable.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">6. data & privacy</h2>
                    <p>
                        please refer to our <Link to="/privacy" className="underline hover:text-black">privacy policy</Link> for details on how we handle your data.
                        we collect a device identifier and usage counts to manage your quota. we do not store your photos on our servers.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">7. disclaimers</h2>
                    <p>
                        the service is provided "as is" without warranties of any kind. we are not liable for any damages arising from your use of the app.
                        we reserve the right to modify pricing, features, or these terms at any time. continued use of the app after changes constitutes acceptance of the updated terms.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
