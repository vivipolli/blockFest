'use client';

import { useEffect, useState } from 'react';
import { getAllEvents } from '@/services/eventService';
import EventCard from '@/components/events/EventCard';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';

const categories = [
    { id: 'all', name: 'All Events', count: 42 },
    { id: 'tech', name: 'Technology', count: 15 },
    { id: 'business', name: 'Business', count: 12 },
    { id: 'art', name: 'Art & Culture', count: 8 },
    { id: 'gaming', name: 'Gaming', count: 7 }
];

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const { isConnected } = useWallet();

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            try {
                const storedEvents = getAllEvents();
                setEvents(storedEvents);
            } catch (error) {
                console.error("Error loading events:", error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        };

        loadEvents();
    }, []);

    const filteredEvents = selectedCategory === 'all'
        ? events
        : events.filter(event => event.category?.toLowerCase() === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 py-16">
                    <h1 className="text-4xl font-bold text-center mb-4">
                        Discover Amazing Events
                    </h1>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
                        Join groundbreaking blockchain events and collect unique NFT certificates. Connect with the community and build your digital identity.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                            </div>
                            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <h3 className="font-semibold mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-left ${selectedCategory === category.id ? 'bg-gray-50 text-primary' : 'text-gray-700'
                                            }`}
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        <span>{category.name}</span>
                                        <span className="text-sm text-gray-500">{category.count}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 my-6"></div>

                            <h3 className="font-semibold mb-4">Filters</h3>

                            {/* Date Filter */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-2">Date</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                                    <option>Any date</option>
                                    <option>Today</option>
                                    <option>This week</option>
                                    <option>This month</option>
                                    <option>Next 3 months</option>
                                </select>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-2">Price Range</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                                    <option>Any price</option>
                                    <option>Free</option>
                                    <option>Under 0.1 ETH</option>
                                    <option>0.1 - 0.5 ETH</option>
                                    <option>Over 0.5 ETH</option>
                                </select>
                            </div>

                            {/* Location Filter */}
                            <div className="mb-6">
                                <label className="block text-sm text-gray-600 mb-2">Location</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                                    <option>Anywhere</option>
                                    <option>Virtual</option>
                                    <option>North America</option>
                                    <option>Europe</option>
                                    <option>Asia</option>
                                </select>
                            </div>

                            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Sort Options */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">
                                {isLoading
                                    ? "Loading events..."
                                    : `Showing ${filteredEvents.length} events`}
                            </p>
                            <select className="px-3 py-2 border border-gray-200 rounded-lg">
                                <option>Most Popular</option>
                                <option>Newest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                <p className="ml-4 text-gray-600">Loading events...</p>
                            </div>
                        ) : filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map(event => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                                <p className="text-gray-600 mb-6">
                                    {isConnected
                                        ? "Why not create the first event in this category?"
                                        : "You need to connect your wallet to create and discover events."}
                                </p>
                                {isConnected && (
                                    <Link href="/events/create" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-block">
                                        Create Event
                                    </Link>
                                )}
                            </div>
                        )}

                        {!isLoading && filteredEvents.length > 0 && (
                            <div className="mt-12 flex justify-center">
                                <nav className="flex items-center space-x-2">
                                    <button className="p-2 rounded-lg hover:bg-gray-100">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-primary text-white">1</button>
                                    <button className="px-4 py-2 rounded-lg hover:bg-gray-100">2</button>
                                    <button className="px-4 py-2 rounded-lg hover:bg-gray-100">3</button>
                                    <button className="p-2 rounded-lg hover:bg-gray-100">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 