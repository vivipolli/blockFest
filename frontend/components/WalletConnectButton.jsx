'use client';

import { useState, useEffect } from 'react';
import walletService from '../services/walletService';

export default function WalletConnectButton() {
    const [address, setAddress] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        // Add listener for wallet connection changes
        const handleWalletChange = ({ address, isConnected }) => {
            setAddress(address);
            setIsConnected(isConnected);
        };

        walletService.addListener(handleWalletChange);

        // Check if already connected
        if (walletService.isWalletConnected()) {
            setAddress(walletService.getAddress());
            setIsConnected(true);
        }

        // Cleanup listener on unmount
        return () => {
            walletService.removeListener(handleWalletChange);
        };
    }, []);

    const handleConnect = async () => {
        if (isConnected) {
            walletService.disconnect();
            return;
        }

        setIsConnecting(true);
        try {
            await walletService.openWalletModal();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    // Format address for display (first 4 and last 4 characters)
    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
            {isConnecting ? (
                'Connecting...'
            ) : isConnected ? (
                <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {formatAddress(address)}
                </span>
            ) : (
                'Connect Wallet'
            )}
        </button>
    );
} 