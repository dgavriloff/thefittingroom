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

                    <h2 className="text-2xl font-bold text-black mt-8">1. agreement to terms</h2>
                    <p>
                        by accessing our website and using our application, you agree to be bound by these terms of service and our privacy policy.
                        if you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">2. use license</h2>
                    <p>
                        permission is granted to temporarily download one copy of the materials (information or software) on the fitting room's website
                        for personal, non-commercial transitory viewing only.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">3. disclaimer</h2>
                    <p>
                        the materials on the fitting room's website are provided on an 'as is' basis. the fitting room makes no warranties, expressed or implied,
                        and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                        fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">4. limitations</h2>
                    <p>
                        in no event shall the fitting room or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                        or due to business interruption) arising out of the use or inability to use the materials on the fitting room's website.
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-8">5. governing law</h2>
                    <p>
                        these terms and conditions are governed by and construed in accordance with the laws of california and you irrevocably submit to the
                        exclusive jurisdiction of the courts in that state or location.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
