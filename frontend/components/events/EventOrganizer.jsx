import Link from 'next/link';
import Image from 'next/image';
import { convertIpfsUrl } from '@/utils/ipfs';

export default function EventOrganizer({ organizer }) {
    const organizerImageUrl = organizer?.imageUrl ? convertIpfsUrl(organizer.imageUrl) : null;

    return (
        <Link
            href={`/profile/${organizer?.id}`}
            className="flex items-center space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm 
                     hover:bg-white/80 transition-all border border-white/30 shadow-sm group"
        >
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-accent transition-colors">
                {organizerImageUrl ? (
                    <Image
                        src={organizerImageUrl}
                        alt={organizer?.name || 'Organizer'}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-xl text-white font-medium">
                            {organizer?.name?.charAt(0) || 'A'}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-grow">
                <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                    {organizer?.name || 'Anonymous Organizer'}
                </h3>
                <p className="text-sm text-gray-600">
                    {organizer?.events || 0} events · {organizer?.followers || 0} followers
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary 
                                 rounded-full text-sm font-medium transition-colors">
                    Follow
                </button>
            </div>
        </Link>
    );
} 