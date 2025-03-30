import Link from 'next/link';
import Image from 'next/image';
import { convertIpfsUrl } from '@/utils/ipfs';

export default function EventCard({ event }) {
    const imageUrl = event.imageUrl ? convertIpfsUrl(event.imageUrl) : null;

    return (
        <Link
            href={`/events/${event.id}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
            {/* Event Image */}
            <div className="h-48 relative overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                            {event.title.charAt(0)}
                        </span>
                    </div>
                )}
                {/* Category and Price Badge */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">
                        {event.category}
                    </span>
                    <span className={`${event.isPaid ? 'bg-primary' : 'bg-green-500'} text-white text-xs px-3 py-1 rounded-full`}>
                        {event.isPaid ? `${event.price} ETH` : 'Free'}
                    </span>
                </div>
            </div>

            {/* Event Details */}
            <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                </div>

                <div className="flex justify-between items-center">
                    <span className={`${event.isPaid ? 'text-primary' : 'text-green-500'} font-semibold`}>
                        {event.isPaid ? `${event.price} ETH` : 'Free Registration'}
                    </span>
                    <span className="text-sm text-gray-500">
                        {event.spotsLeft} spots left
                    </span>
                </div>
            </div>
        </Link>
    );
} 