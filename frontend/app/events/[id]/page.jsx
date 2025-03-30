'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'react-hot-toast';
import { getEvent } from '@/services/eventService';

import EventHeader from '@/components/events/EventHeader';
import EventContent from '@/components/events/EventContent';
import EventSidebar from '@/components/events/EventSidebar';
import ShareModal from '@/components/events/ShareModal';
import PaymentModal from '@/components/events/PaymentModal';
import RegistrationModal from '@/components/events/RegistrationModal';

export default function EventPage({ params }) {
    const unwrappedParams = use(params);
    const eventId = unwrappedParams.id;
    const [showFullSchedule, setShowFullSchedule] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [event, setEvent] = useState({
        id: '',
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        price: '0',
        isPaid: false,
        spotsAvailable: '0',
        organizer: {
            name: '',
            id: '',
            wallet: ''
        },
        status: 'upcoming',
        metadataUrl: '',
        imageUrl: '',
        color: 'primary',
        gradient: 'from-primary to-primary-dark',
        tags: [],
        speakers: [],
        schedule: [],
        attendees: 0,
        totalSpots: 100
    });

    const { isConnected } = useWallet();
    const router = useRouter();

    useEffect(() => {
        const storedEvent = getEvent(eventId);
        if (storedEvent) {
            setEvent(storedEvent);
        }
    }, [eventId]);

    const handleShareClick = (type) => {
        if (type === 'followers' && !isConnected) {
            router.push('/login?redirect=' + encodeURIComponent(`/events/${eventId}`));
            return;
        }

        switch (type) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=Check out ${event.title}&url=${encodeURIComponent(window.location.href)}`);
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`);
                break;
            case 'followers':
                setIsShareModalOpen(true);
                break;
            default:
                break;
        }
    };

    const handleRegister = () => {
        if (!isConnected) {
            router.push('/login?redirect=' + encodeURIComponent(`/events/${eventId}`));
            return;
        }

        if (event.isPaid) {
            setShowPaymentModal(true);
        } else {
            setShowRegistrationModal(true);
        }
    };

    const handlePaymentSuccess = () => {
        toast.success('NFT Ticket minted successfully!');
        //router.push('/my-profile?tab=tickets');
    };

    const handleRegistrationSuccess = () => {
        toast.success('Registration completed successfully!');
        router.push('/my-profile?tab=tickets');
    };

    return (
        <div className="min-h-screen bg-white">
            <EventHeader event={event} />


            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <EventContent
                        event={event}
                        showFullSchedule={showFullSchedule}
                        setShowFullSchedule={setShowFullSchedule}
                    />
                    <EventSidebar
                        event={event}
                        handleRegister={handleRegister}
                        handleShareClick={handleShareClick}
                        router={router}
                    />
                </div>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                event={event}
            />

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                event={event}
                onSuccess={handlePaymentSuccess}
            />

            <RegistrationModal
                isOpen={showRegistrationModal}
                onClose={() => setShowRegistrationModal(false)}
                event={event}
                onSuccess={handleRegistrationSuccess}
            />
        </div>
    );
}