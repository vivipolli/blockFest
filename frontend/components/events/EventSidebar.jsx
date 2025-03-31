import EventOrganizer from "./EventOrganizer";

export default function EventSidebar({ event, handleRegister, handleShareClick, router, isConnected }) {
    return (
        <div className="lg:w-96">
            <div className="sticky top-6 space-y-6">
                {/* Ticket Card */}
                <EventOrganizer organizer={event.organizer} />
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600">Price</p>
                                <p className="text-2xl font-bold">
                                    {event.isPaid ? `${event.price} STX` : 'Free'}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${event.status === 'upcoming'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                {event.status}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Spots Available</p>
                            <p className="font-medium">{event.spotsLeft} spots left</p>
                        </div>
                        {isConnected &&

                            <button
                                onClick={handleRegister}
                                className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                            >
                                Get Ticket
                            </button>
                        }
                    </div>
                </div>

                {/* Share and Contact Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-6 space-y-6">
                    <div>
                        <h3 className="font-medium mb-4">Share this event</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleShareClick('twitter')}
                                className="flex-1 py-2 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm transition-colors"
                            >
                                Twitter
                            </button>
                            <button
                                onClick={() => handleShareClick('linkedin')}
                                className="flex-1 py-2 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm transition-colors"
                            >
                                LinkedIn
                            </button>
                            <button
                                onClick={() => handleShareClick('followers')}
                                className="flex-1 py-2 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm transition-colors"
                            >
                                Followers
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4">Contact organizer</h3>
                        <button
                            onClick={() => router.push(`/messages/${event.organizer.id}`)}
                            className="w-full py-2 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm transition-colors"
                        >
                            Send Message
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
} 