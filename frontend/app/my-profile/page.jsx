'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { toast, Toaster } from 'react-hot-toast';
import { isValidIpfsUrl, convertIpfsUrl } from '@/utils/ipfs';
import TicketCard from '@/components/tickets/TicketCard';

const organizedEvents = [
    {
        id: 1,
        name: 'Web3 Workshop',
        date: 'Apr 20, 2024',
        location: 'Virtual',
        attendees: 156,
        status: 'upcoming',
        color: 'secondary'
    },
    // ... more events
];

export default function MyProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const { isConnected, address } = useWallet();
    const [formData, setFormData] = useState({
        name: 'Alex Turner',
        username: '@alexturner',
        bio: 'Blockchain enthusiast | Event organizer | NFT collector',
        email: 'alex@example.com',
        location: 'New York, NY',
        website: 'alexturner.eth',
        isOrganizer: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [isTicketsLoading, setIsTicketsLoading] = useState(true);
    const [nftMetadata, setNftMetadata] = useState({});
    const [isNftLoading, setIsNftLoading] = useState({});

    useEffect(() => {
        setIsProfileLoading(true);
        const savedProfileData = localStorage.getItem('user_profile_data');
        if (savedProfileData) {
            setFormData(JSON.parse(savedProfileData));
        }
        setIsProfileLoading(false);

        const loadTickets = async () => {
            try {
                const storedTickets = localStorage.getItem('nftTicket');
                if (storedTickets) {
                    const parsedTickets = JSON.parse(storedTickets);
                    setTickets(parsedTickets);

                    // Iniciar carregamento de metadados para tickets confirmados
                    const confirmedTickets = parsedTickets.filter(ticket => ticket.confirmed);
                    confirmedTickets.forEach(ticket => {
                        fetchTicketMetadata(ticket.transactionHash, ticket.eventInfo);
                    });
                }
            } catch (error) {
                console.error('Error loading tickets:', error);
            } finally {
                setIsTicketsLoading(false);
            }
        };

        loadTickets();
    }, []);

    const truncateAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Save profile data to localStorage
        localStorage.setItem('user_profile_data', JSON.stringify(formData));

        // Show success message
        toast.success('Profile saved locally. In the future, this will be stored in a database.', {
            duration: 3000,
        });

        setIsEditing(false);
    };

    const fetchTicketMetadata = async (ticketId, eventInfo) => {
        setIsNftLoading(prev => ({ ...prev, [ticketId]: true }));

        try {
            const uri = convertIpfsUrl(eventInfo);
            const response = await fetch(uri);
            if (!response.ok) throw new Error('Failed to fetch metadata');
            const data = await response.json();

            setNftMetadata(prev => ({
                ...prev,
                [ticketId]: data
            }));
        } catch (error) {
            console.error('Error fetching metadata:', error);
            setNftMetadata(prev => ({
                ...prev,
                [ticketId]: null
            }));
        } finally {
            setIsNftLoading(prev => ({ ...prev, [ticketId]: false }));
        }
    };

    const handleConfirmPresence = async (ticketId) => {
        try {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        // Update the ticket list to mark the ticket as confirmed
                        const updatedTickets = tickets.map(ticket => {
                            if (ticket.transactionHash === ticketId) {
                                return { ...ticket, confirmed: true };
                            }
                            return ticket;
                        });
                        setTickets(updatedTickets);
                        localStorage.setItem('nftTicket', JSON.stringify(updatedTickets));

                        // Buscar metadados para o ticket recém-confirmado
                        const confirmedTicket = updatedTickets.find(t => t.transactionHash === ticketId);
                        if (confirmedTicket) {
                            fetchTicketMetadata(ticketId, confirmedTicket.eventInfo);
                        }

                        toast.success('Presença confirmada com sucesso!');
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        toast.error('Por favor, habilite os serviços de localização para confirmar presença');
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            } else {
                toast.error('Geolocalização não é suportada pelo seu navegador');
            }
        } catch (error) {
            console.error('Confirm presence error:', error);
            toast.error('Falha ao confirmar presença');
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">My Profile</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-center" />

            {/* Profile Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-2xl font-bold">My Profile</h1>
                        {activeTab === 'profile' && (
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex space-x-6 border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`pb-4 px-2 text-sm font-medium relative ${activeTab === 'profile'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('tickets')}
                            className={`pb-4 px-2 text-sm font-medium relative ${activeTab === 'tickets'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            My Tickets
                        </button>
                        {formData?.isOrganizer && (
                            <button
                                onClick={() => setActiveTab('events')}
                                className={`pb-4 px-2 text-sm font-medium relative ${activeTab === 'events'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Organized Events
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('nfts')}
                            className={`pb-4 px-2 text-sm font-medium relative ${activeTab === 'nfts'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            My NFTs
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-6 py-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="max-w-2xl">
                        {isProfileLoading ? (
                            <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-center items-center h-64">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                                    <p className="text-gray-600">Loading profile data...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                                {/* Wallet Address Display */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Connected Wallet
                                    </label>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/5 rounded-xl border border-secondary/10">
                                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                                        <span className="text-sm font-medium text-secondary">
                                            {address ?
                                                truncateAddress(address) :
                                                'No wallet connected'
                                            }
                                        </span>
                                    </div>
                                </div>

                                {/* Profile Form */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            rows="3"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                                        />
                                    </div>

                                    {isEditing && (
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    )}

                                    {/* Local storage notice */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                                        <p className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                            </svg>
                                            Profile data is currently stored in your browser's local storage. In the future, this will be saved to a database.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tickets Tab */}
                {activeTab === 'tickets' && (
                    <div>
                        <h2 className="text-xl font-bold mb-6">My Tickets</h2>

                        {isTicketsLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                                    <p className="text-gray-600">Loading your tickets...</p>
                                </div>
                            </div>
                        ) : tickets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tickets.map((ticket, index) => (
                                    <TicketCard
                                        key={ticket.transactionHash || index}
                                        ticket={ticket}
                                        onConfirmPresence={() => handleConfirmPresence(ticket.transactionHash)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                                <p className="mb-4">You don't have any tickets yet</p>
                                <p className="text-sm">Purchase tickets to events to see them here</p>
                                <Link
                                    href="/events"
                                    className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                                >
                                    Browse Events
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Organized Events Tab */}
                {activeTab === 'events' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Your Events</h2>
                            <Link
                                href="/events/create"
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                            >
                                Create New Event
                            </Link>
                        </div>

                        {organizedEvents.map(event => (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between"
                            >
                                <div className="space-y-2 mb-4 md:mb-0">
                                    <h3 className="font-bold text-lg">{event.name}</h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span>{event.date}</span>
                                        <span>•</span>
                                        <span>{event.location}</span>
                                        <span>•</span>
                                        <span>{event.attendees} attendees</span>
                                    </div>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${event.status === 'upcoming'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={`/events/${event.id}/manage`}
                                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        Manage Event
                                    </Link>
                                    <Link
                                        href={`/events/${event.id}/analytics`}
                                        className="px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-sm"
                                    >
                                        View Analytics
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* NFTs Tab */}
                {activeTab === 'nfts' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">Your NFT Collection</h2>
                        {isTicketsLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading your NFTs...</p>
                            </div>
                        ) : tickets.filter(ticket => ticket.confirmed).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tickets
                                    .filter(ticket => ticket.confirmed)
                                    .map((ticket, index) => {
                                        const ticketId = ticket.transactionHash;
                                        const isLoading = isNftLoading[ticketId];
                                        const metadata = nftMetadata[ticketId];

                                        if (isLoading) {
                                            return (
                                                <div key={ticketId || index} className="bg-white rounded-xl shadow-sm p-6 flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                                </div>
                                            );
                                        }

                                        if (!metadata) {
                                            return (
                                                <div key={ticketId || index} className="bg-white rounded-xl shadow-sm p-6">
                                                    <p className="text-red-500">Failed to load NFT data</p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={ticketId || index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                                {metadata.image && (
                                                    <img
                                                        src={metadata.image.startsWith('ipfs://') ? convertIpfsUrl(metadata.image) : metadata.image}
                                                        alt={metadata.name || 'NFT'}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                )}
                                                <div className="p-4">
                                                    <h3 className="text-lg font-bold">{metadata.name}</h3>
                                                    <p className="text-gray-600">{metadata.description}</p>
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {metadata.attributes && metadata.attributes.map((attr, i) => (
                                                            <span key={i} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                                                {attr.trait_type}: {attr.value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                                <p className="mb-4">You don't have any confirmed NFTs yet</p>
                                <p className="text-sm">Attend events and confirm your presence to collect NFTs</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 