'use client';

import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import EventCreationForm from '@/components/EventCreationForm';

export default function CreateEventPage() {
    const { isConnected } = useWallet();
    const router = useRouter();
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(() => {
            attempts++;
            if (isConnected || attempts >= maxAttempts) {
                clearInterval(interval);
                setIsValidating(false);

                if (!isConnected && attempts >= maxAttempts) {
                    toast.error('You must be connected to a wallet to create an event');
                    router.push('/');
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isConnected, router]);

    if (isValidating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600">Validating authentication...</p>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return null;
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />

            {/* Animated Circles */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Content */}
            <div className="relative">
                <Toaster position="top-center" />

                <div className="container mx-auto px-6 py-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center space-x-4 mb-8">
                            <h1 className="text-3xl font-bold glow-primary">Create New Event</h1>
                            <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded-full" />
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-8 relative">
                            {/* Decorative corner elements */}
                            <div className="absolute top-0 left-0 w-20 h-20">
                                <div className="absolute top-0 left-0 w-2 h-8 bg-primary/20 rounded-full" />
                                <div className="absolute top-0 left-0 h-2 w-8 bg-primary/20 rounded-full" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-20 h-20">
                                <div className="absolute bottom-0 right-0 w-2 h-8 bg-primary/20 rounded-full" />
                                <div className="absolute bottom-0 right-0 h-2 w-8 bg-primary/20 rounded-full" />
                            </div>

                            <EventCreationForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 