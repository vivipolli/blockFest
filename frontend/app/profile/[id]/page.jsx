'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import NftCard from '@/components/nft/NftCard';
import { toast, Toaster } from 'react-hot-toast';

// Sample user data - in a real app, this would come from an API
const userData = {
    id: '1',
    name: 'Alex Turner',
    username: '@alexturner',
    bio: 'Blockchain enthusiast | Event organizer | NFT collector | Building the future of digital experiences',
    location: 'New York, NY',
    website: 'alexturner.eth',
    joinedDate: 'Joined December 2023',
    following: 234,
    followers: 1289,
    coverImage: '/images/cover.jpg',
    avatarImage: '/images/avatar.jpg',
    stats: {
        eventsAttended: 15,
        nftsCollected: 23,
        eventsOrganized: 5
    }
};

export default function ProfilePage({ params }) {
    const { id } = use(params);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('collected');
    const [userNFTs, setUserNFTs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userAddress = id.startsWith('ST')
            ? id
            : 'ST2K82ZG0VDAZPMMRDXMPHZQP732Y2S7A004HTETD';

        const loadNFTs = async () => {
            setIsLoading(true);
            try {
                //const nfts = await getNftsForAddress(userAddress);
                //setUserNFTs(nfts);
                console.log('userAddress', userAddress);
            } catch (error) {
                console.error('Error loading NFTs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadNFTs();
    }, [id]);

    const isValidTokenUri = (uri) => {
        return uri && (uri.startsWith('http://') || uri.startsWith('https://'));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Cover Image */}
            <div className="h-64 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
            </div>

            {/* Profile Header */}
            <div className="container mx-auto px-6">
                <div className="relative -mt-20 mb-8">
                    {/* Avatar */}
                    <div className="absolute -top-16 left-6">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="text-4xl text-white font-bold">
                                    {userData.name.charAt(0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="flex justify-end items-center pt-4">
                        <div className="flex gap-4">
                            <button className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                                Share Profile
                            </button>
                            <button
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={`px-6 py-2 rounded-full transition-colors ${isFollowing
                                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">{userData.name}</h1>
                    <p className="text-gray-600 mb-4">{userData.username}</p>

                    <p className="text-gray-700 mb-4 max-w-2xl">
                        {userData.bio}
                    </p>

                    <div className="flex flex-wrap gap-6 text-gray-600 text-sm mb-4">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {userData.location}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            {userData.website}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {userData.joinedDate}
                        </div>
                    </div>

                    <div className="flex gap-6 text-sm">
                        <Link href="#" className="hover:text-primary">
                            <span className="font-bold">{userData.following}</span>
                            <span className="text-gray-600 ml-1">Following</span>
                        </Link>
                        <Link href="#" className="hover:text-primary">
                            <span className="font-bold">{userData.followers}</span>
                            <span className="text-gray-600 ml-1">Followers</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold mb-1">{userData.stats.eventsAttended}</div>
                        <div className="text-gray-600">Events Attended</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold mb-1">{userData.stats.nftsCollected}</div>
                        <div className="text-gray-600">NFTs Collected</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold mb-1">{userData.stats.eventsOrganized}</div>
                        <div className="text-gray-600">Events Organized</div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('collected')}
                            className={`pb-4 px-2 text-sm font-medium relative ${activeTab === 'collected'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Collected NFTs
                        </button>
                        <button
                            onClick={() => setActiveTab('organized')}
                            className={`pb-4 px-2 text-sm font-medium relative ${activeTab === 'organized'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Organized Events
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`pb-4 px-2 text-sm font-medium relative ${activeTab === 'activity'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Activity
                        </button>
                    </nav>
                </div>

                {/* NFT Grid */}
                {activeTab === 'collected' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {isLoading ? (
                            <div className="col-span-3 text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading NFTs...</p>
                            </div>
                        ) : userNFTs.filter(nft => isValidTokenUri(nft.tokenUri)).length > 0 ? (
                            userNFTs
                                .filter(nft => isValidTokenUri(nft.tokenUri))
                                .map(nft => (
                                    <NftCard key={nft.value.repr.replace('u', '')} tokenUri={nft.tokenUri} tx_id={nft.tx_id || nft.txid} />
                                ))
                        ) : (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                                No NFTs found for this user
                            </div>
                        )}
                    </div>
                )}

                {/* Organized Events */}
                {activeTab === 'organized' && (
                    <div className="text-center py-12 text-gray-500">
                        No events organized yet
                    </div>
                )}

                {/* Activity Feed */}
                {activeTab === 'activity' && (
                    <div className="text-center py-12 text-gray-500">
                        No recent activity
                    </div>
                )}
            </div>
        </div>
    );
} 