import Link from 'next/link';

const categories = [
    { id: 'all', name: 'All NFTs', count: 156 },
    { id: 'tech', name: 'Tech Events', count: 45 },
    { id: 'conference', name: 'Conferences', count: 38 },
    { id: 'summit', name: 'Summits', count: 32 },
    { id: 'workshop', name: 'Workshops', count: 41 }
];

const nfts = [
    {
        id: 1,
        title: 'ETH Global 2023',
        creator: 'ETH Foundation',
        price: '0.85 ETH',
        highestBid: '0.95 ETH',
        endTime: '2d 15h',
        image: '/images/nft1.jpg',
        attendees: 1240,
        date: 'Oct 15, 2023',
        location: 'Berlin, Germany',
        rarity: 'Legendary',
        color: 'primary'
    },
    // ... add more NFTs
];

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 py-16">
                    <h1 className="text-4xl font-bold text-center mb-4">
                        NFT Event Collectibles
                    </h1>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
                        Discover and collect unique NFTs from past events. Each NFT serves as a digital certificate of attendance and a piece of event history.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search NFTs..."
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
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-left"
                                    >
                                        <span className="text-gray-700">{category.name}</span>
                                        <span className="text-sm text-gray-500">{category.count}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 my-6"></div>

                            <h3 className="font-semibold mb-4">Filters</h3>

                            {/* Price Filter */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-2">Price Range</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                                    <option>Any price</option>
                                    <option>Under 0.1 ETH</option>
                                    <option>0.1 - 0.5 ETH</option>
                                    <option>0.5 - 1 ETH</option>
                                    <option>Over 1 ETH</option>
                                </select>
                            </div>

                            {/* Rarity Filter */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-2">Rarity</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                                    <option>All</option>
                                    <option>Common</option>
                                    <option>Rare</option>
                                    <option>Epic</option>
                                    <option>Legendary</option>
                                </select>
                            </div>

                            {/* Event Date Filter */}
                            <div className="mb-6">
                                <label className="block text-sm text-gray-600 mb-2">Event Date</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                                    <option>Any time</option>
                                    <option>Last month</option>
                                    <option>Last 3 months</option>
                                    <option>Last 6 months</option>
                                    <option>Last year</option>
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
                            <p className="text-gray-600">Showing 156 NFTs</p>
                            <select className="px-3 py-2 border border-gray-200 rounded-lg">
                                <option>Recently Listed</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Most Popular</option>
                            </select>
                        </div>

                        {/* NFTs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {nfts.map(nft => (
                                <Link
                                    key={nft.id}
                                    href={`/marketplace/${nft.id}`}
                                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    {/* NFT Preview */}
                                    <div className={`h-64 bg-${nft.color}/10 relative overflow-hidden`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br from-${nft.color}/20 to-transparent`}></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className={`w-40 h-40 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center p-4 rotate-3 border-2 border-${nft.color}/30`}>
                                                <div className={`text-${nft.color} text-4xl font-bold mb-2`}>
                                                    {nft.title.split(' ')[0].charAt(0)}{nft.title.split(' ')[1]?.charAt(0) || ''}
                                                </div>
                                                <div className="text-xs text-gray-500 text-center">{nft.title}</div>
                                                <div className="mt-2 text-xs px-3 py-1 bg-gray-100 rounded-full">{nft.date}</div>
                                            </div>
                                        </div>

                                        {/* Rarity Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className={`bg-${nft.color} text-white text-xs px-2 py-1 rounded-full`}>
                                                {nft.rarity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* NFT Details */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg text-foreground">{nft.title}</h3>
                                            <span className={`text-${nft.color} font-bold`}>{nft.price}</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {nft.creator}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600 mb-4">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {nft.location}
                                        </div>

                                        {/* Auction Info */}
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Highest bid</span>
                                                <span className="font-medium">{nft.highestBid}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Ends in</span>
                                                <span className="font-medium">{nft.endTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
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
                    </div>
                </div>
            </div>
        </div>
    );
} 