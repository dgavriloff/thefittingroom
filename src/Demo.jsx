import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Demo = () => {
    return (
        <div className="min-h-screen bg-brand-offwhite p-10 font-sans text-black">
            <div className="container mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 mb-10 text-gray-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={20} />
                    back to home
                </Link>

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">see it in action</h1>
                    <p className="text-xl text-gray-500 font-medium">
                        experience the future of fitting rooms. upload, try on, and decide — all in seconds.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {[
                        { src: "/demo-1.png", alt: "Upload interface showing model and clothes" },
                        { src: "/demo-2.png", alt: "Before view of the model" },
                        { src: "/demo-3.png", alt: "After view showing the virtual try-on result" }
                    ].map((item, index) => (
                        <div key={index} className="relative group">
                            <div className="absolute inset-0 bg-black/5 rounded-[40px] transform rotate-3 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                            <div className="relative overflow-hidden rounded-[32px] border-4 border-white shadow-2xl bg-white">
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Demo;
