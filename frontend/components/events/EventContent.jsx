export default function EventContent({ event, showFullSchedule, setShowFullSchedule }) {
    return (
        <div className="flex-1 space-y-12">
            {/* About */}
            <section>
                <h2 className="text-xl font-bold mb-4">About this event</h2>
                <div className="prose max-w-none">
                    {event.description?.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-600">{paragraph}</p>
                    ))}
                </div>
            </section>

            {/* Speakers */}
            {event.speakers?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-6">Featured Speakers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {event.speakers.map(speaker => (
                            <div key={speaker.name} className="flex items-start space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                    <span className="text-xl font-medium text-gray-600">
                                        {speaker.name?.charAt(0) || '?'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-medium">{speaker.name}</h3>
                                    <p className="text-sm text-gray-600">{speaker.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Schedule */}
            {event.schedule?.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-6">Event Schedule</h2>
                    <div className="space-y-8">
                        {event.schedule.slice(0, showFullSchedule ? undefined : 1).map(day => (
                            <div key={day.day}>
                                <h3 className="font-medium mb-4">{day.day}</h3>
                                <div className="space-y-4">
                                    {day.sessions?.map(session => (
                                        <div key={session.time} className="flex">
                                            <div className="w-24 flex-shrink-0">
                                                <span className="text-gray-600">{session.time}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{session.title}</h4>
                                                {session.speaker && (
                                                    <p className="text-sm text-gray-600">
                                                        {session.speaker} · {session.duration}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {event.schedule.length > 1 && (
                        <button
                            onClick={() => setShowFullSchedule(!showFullSchedule)}
                            className="mt-6 text-primary hover:text-primary-dark transition-colors"
                        >
                            {showFullSchedule ? 'Show less' : 'Show full schedule'}
                        </button>
                    )}
                </section>
            )}
        </div>
    );
}