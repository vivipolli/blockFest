'use client';

import { useState } from 'react';
import Link from 'next/link';

const nfts = [
    {
        id: 1,
        title: "Web3 Summit 2023",
        creator: "Web3 Foundation",
        price: "0.85 ETH",
        image: "/images/nft1.jpg",
        attendees: 1240,
        date: "Oct 15, 2023",
        location: "Berlin, Germany",
        rarity: "Rare",
        color: "primary"
    },
    {
        id: 2,
        title: "Crypto Art Festival",
        creator: "Digital Art Collective",
        price: "0.45 ETH",
        image: "/images/nft2.jpg",
        attendees: 850,
        date: "Sep 22, 2023",
        location: "Paris, France",
        rarity: "Common",
        color: "secondary"
    },
    {
        id: 3,
        title: "DeFi Conference 2023",
        creator: "DeFi Alliance",
        price: "1.2 ETH",
        image: "/images/nft3.jpg",
        attendees: 1100,
        date: "Aug 10, 2023",
        location: "Singapore",
        rarity: "Legendary",
        color: "accent"
    },
    {
        id: 4,
        title: "Blockchain Gaming Expo",
        creator: "GameFi Network",
        price: "0.65 ETH",
        image: "/images/nft4.jpg",
        attendees: 1500,
        date: "Jul 5, 2023",
        location: "Tokyo, Japan",
        rarity: "Epic",
        color: "primary"
    }
];

const NFTCard = ({ nft }) => {
    return (
        <div className="group relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className={`h-64 bg-${nft.color}/10 relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br from-${nft.color}/20 to-transparent`}></div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-40 h-40 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center p-4 rotate-3 border-2 border-${nft.color}/30`}>
                        <div className={`text-${nft.color} text-4xl font-bold mb-2`}>{nft.title.charAt(0)}{nft.title.split(' ')[1]?.charAt(0) || ''}</div>
                        <div className="text-xs text-gray-500 text-center">{nft.title}</div>
                        <div className="mt-2 text-xs px-3 py-1 bg-gray-100 rounded-full">{nft.date}</div>
                    </div>
                </div>

                {/* Rarity Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`bg-${nft.color} text-white text-xs px-3 py-1 rounded-full`}>
                        {nft.rarity}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-foreground">{nft.title}</h3>
                    <span className={`text-${nft.color} font-bold`}>{nft.price}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    {nft.creator}
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {nft.location}
                </div>

                <div className="flex gap-2 mt-4">
                    <Link
                        href={`/marketplace/${nft.id}`}
                        className={`flex-1 text-center py-2 px-4 rounded-full bg-${nft.color} text-white hover:bg-${nft.color}-dark transition-colors duration-300`}
                    >
                        Buy Now
                    </Link>
                    <button
                        className={`p-2 rounded-full border-2 border-${nft.color} text-${nft.color} hover:bg-${nft.color}/10 transition-colors duration-300`}
                        aria-label="Add to favorites"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                <div className="flex flex-col gap-3 p-6">
                    <Link
                        href={`/marketplace/${nft.id}`}
                        className="px-6 py-2 bg-white text-foreground rounded-full hover:bg-gray-100 transition-colors text-center"
                    >
                        View Details
                    </Link>
                    <button className={`px-6 py-2 bg-${nft.color} text-white rounded-full hover:bg-${nft.color}-dark transition-colors`}>
                        Quick Buy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function FeaturedNFTs() {
    const [activeTab, setActiveTab] = useState('all');

    const filteredNFTs = activeTab === 'all'
        ? nfts
        : nfts.filter(nft => nft.rarity.toLowerCase() === activeTab);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">Featured NFT Collectibles</h2>
                        <p className="text-gray-600 mt-2">Exclusive digital memorabilia from past events</p>
                    </div>
                    <Link href="/marketplace" className="text-primary hover:underline font-medium">
                        Visit Marketplace →
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'all'
                            ? 'bg-foreground text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All NFTs
                    </button>
                    <button
                        onClick={() => setActiveTab('legendary')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'legendary'
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Legendary
                    </button>
                    <button
                        onClick={() => setActiveTab('epic')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'epic'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Epic
                    </button>
                    <button
                        onClick={() => setActiveTab('rare')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'rare'
                            ? 'bg-secondary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Rare
                    </button>
                    <button
                        onClick={() => setActiveTab('common')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'common'
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Common
                    </button>
                </div>

                {/* NFT Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredNFTs.map(nft => (
                        <NFTCard key={nft.id} nft={nft} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredNFTs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No NFTs found in this category.</p>
                    </div>
                )}

                {/* Marketplace Promo */}
                <div className="mt-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-3">Discover More in Our NFT Marketplace</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Browse hundreds of exclusive event NFTs, build your collection and trade with other enthusiasts.
                    </p>
                    <Link
                        href="/marketplace"
                        className="inline-block px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors box-glow-primary"
                    >
                        Explore Marketplace
                    </Link>
                </div>
            </div>
        </section>
    );
} 