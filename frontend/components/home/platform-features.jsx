'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import React from 'react';

function useElementOnScreen(options) {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const callbackFunction = (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
            setIsVisible(true);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(callbackFunction, options);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, [containerRef, options]);

    return [containerRef, isVisible];
}

const FeatureCard = ({ icon, title, description, color, index }) => {
    const [ref, isVisible] = useElementOnScreen({ threshold: 0.2 });

    return (
        <div
            ref={ref}
            className={`bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transform transition-all duration-700 ${isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-20 opacity-0'
                }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div className={`w-16 h-16 rounded-full bg-${color}/10 flex items-center justify-center mb-6`}>
                <span className={`text-${color} text-2xl`}>{icon}</span>
            </div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

const InteractiveFeatureShowcase = () => {
    const [ref, isVisible] = useElementOnScreen({ threshold: 0.2 });

    return (
        <div
            ref={ref}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
        >
            <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Discover Events Worldwide</h3>
                <p className="text-gray-600 mb-6">
                    Join a global community of event organizers and attendees. Connect, participate,
                    and collect unique digital memorabilia from events around the world.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                        { name: 'Blockchain Conference', location: 'New York', color: 'bg-primary' },
                        { name: 'NFT Art Expo', location: 'Paris', color: 'bg-secondary' },
                        { name: 'Tech Summit', location: 'Tokyo', color: 'bg-accent' },
                        { name: 'Web3 Meetup', location: 'Sydney', color: 'bg-primary/80' }
                    ].map((event, index) => (
                        <div
                            key={index}
                            className="flex items-center p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className={`w-10 h-10 rounded-full ${event.color} flex items-center justify-center mr-3`}>
                                <span className="text-white text-sm">
                                    {event.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm">{event.name}</h4>
                                <p className="text-xs text-gray-500">{event.location}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Link
                        href="/events"
                        className="px-6 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                        Explore All Events
                    </Link>
                </div>
            </div>

            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
        </div>
    );
};

export default function PlatformFeatures() {
    const [ref, isVisible] = useElementOnScreen({ threshold: 0.1 });

    const features = [
        {
            icon: "🔗",
            title: "Digital Identity",
            description: "Build your unique digital identity through event participation and NFT collections that showcase your interests and experiences.",
            color: "primary"
        },
        {
            icon: "🌐",
            title: "Community Connections",
            description: "Connect with like-minded individuals, follow event organizers, and build your network in the blockchain and event space.",
            color: "secondary"
        },
        {
            icon: "🏆",
            title: "Exclusive Collectibles",
            description: "Receive and trade unique NFTs that serve as proof of attendance and exclusive digital memorabilia from your favorite events.",
            color: "accent"
        },
        {
            icon: "📊",
            title: "Interactive Ecosystem",
            description: "Engage in a dynamic ecosystem where organizers and participants connect, share, and build relationships beyond the event itself.",
            color: "primary"
        }
    ];

    return (
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div
                    ref={ref}
                    className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        More Than Just Tickets - A Complete <span className="text-primary">Web3</span> Experience
                    </h2>
                    <p className="text-lg text-gray-600">
                        Our platform isn't just a marketplace for event tickets. It's a hub of experiences, innovation, and community within the blockchain revolution.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                color={feature.color}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Right Side - Interactive Feature Showcase */}
                    <div className="space-y-8">
                        <InteractiveFeatureShowcase />
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-20 text-center">
                    <h3 className="text-2xl font-bold mb-6">Ready to Join the Revolution?</h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors box-glow-primary text-center font-medium"
                        >
                            Create Your Profile
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary hover:text-white transition-colors text-center font-medium"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
} 