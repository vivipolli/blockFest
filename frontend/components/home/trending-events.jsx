'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Sample event data - in a real app, this would come from an API
const events = [
    {
        id: 1,
        title: 'Blockchain Summit 2023',
        date: 'Dec 15, 2023',
        location: 'New York, NY',
        category: 'Technology',
        image: '/images/event1.jpg',
        attendees: 1240,
        price: '$99',
        organizer: 'Tech Innovations Inc.',
        color: 'primary'
    },
    {
        id: 2,
        title: 'NFT Art Exhibition',
        date: 'Jan 22, 2024',
        location: 'Miami, FL',
        category: 'Art',
        image: '/images/event2.jpg',
        attendees: 850,
        price: '$75',
        organizer: 'Digital Art Collective',
        color: 'secondary'
    },
    {
        id: 3,
        title: 'Web3 Developer Conference',
        date: 'Feb 10, 2024',
        location: 'San Francisco, CA',
        category: 'Development',
        image: '/images/event3.jpg',
        attendees: 2100,
        price: '$149',
        organizer: 'Web3 Foundation',
        color: 'accent'
    },
    {
        id: 4,
        title: 'Crypto Investment Forum',
        date: 'Mar 5, 2024',
        location: 'London, UK',
        category: 'Finance',
        image: '/images/event4.jpg',
        attendees: 780,
        price: '$199',
        organizer: 'Global Finance Partners',
        color: 'primary'
    },
    {
        id: 5,
        title: 'Metaverse Music Festival',
        date: 'Apr 18, 2024',
        location: 'Virtual Event',
        category: 'Entertainment',
        image: '/images/event5.jpg',
        attendees: 5400,
        price: '$45',
        organizer: 'Meta Sounds',
        color: 'secondary'
    },
    {
        id: 6,
        title: 'DeFi Strategy Summit',
        date: 'May 12, 2024',
        location: 'Singapore',
        category: 'Finance',
        image: '/images/event6.jpg',
        attendees: 920,
        price: '$129',
        organizer: 'DeFi Alliance',
        color: 'accent'
    }
];

// Event Card Component
const EventCard = ({ event }) => {
    return (
        <div className="flex-shrink-0 w-full sm:w-[280px] md:w-[320px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            {/* Event Image Placeholder */}
            <div className={`h-40 bg-${event.color}/20 relative flex items-center justify-center`}>
                <div className={`absolute inset-0 bg-gradient-to-r from-${event.color}/30 to-transparent`}></div>
                <span className={`text-${event.color} text-4xl font-bold`}>{event.title.charAt(0)}</span>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`bg-${event.color} text-white text-xs px-2 py-1 rounded-full`}>
                        {event.category}
                    </span>
                </div>
            </div>

            {/* Event Details */}
            <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-foreground">{event.title}</h3>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {event.date}
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {event.location}
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        {event.attendees} attendees
                    </div>
                    <span className={`text-${event.color} font-bold`}>{event.price}</span>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                    <Link
                        href={`/events/${event.id}`}
                        className={`w-full inline-block text-center py-2 px-4 rounded-full border-2 border-${event.color} text-${event.color} hover:bg-${event.color} hover:text-white transition-colors duration-300`}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function TrendingEvents() {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Check if scroll arrows should be shown
    const checkScrollPosition = () => {
        if (!scrollContainerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScrollPosition);
            // Initial check
            checkScrollPosition();

            return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
        }
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { clientWidth } = scrollContainerRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">Trending Events</h2>
                        <p className="text-gray-600 mt-2">Discover the hottest upcoming blockchain events</p>
                    </div>
                    <Link href="/events" className="text-primary hover:underline font-medium">
                        View All Events →
                    </Link>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Left Arrow */}
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100"
                            aria-label="Scroll left"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                    )}

                    {/* Events Carousel */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {events.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>

                    {/* Right Arrow */}
                    {showRightArrow && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100"
                            aria-label="Scroll right"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
} 