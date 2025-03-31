'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import { request } from '@stacks/connect';
import ticketNftService from '@/services/ticketNftService';
import walletService from '@/services/walletService';
import StellarSdk from 'stellar-sdk';

export default function PaymentModal({ isOpen, onClose, event, onSuccess }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionStarted, setTransactionStarted] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [error, setError] = useState(null);
    const [metadataUri, setMetadataUri] = useState(null);
    const [ticketId, setTicketId] = useState(null);
    const { isConnected, address } = useWallet();

    const handlePayment = async () => {
        try {
            setIsProcessing(true);
            setTransactionStarted(false);
            setTransactionId(null);
            setPaymentComplete(false);
            setError(null);

            if (!address) {
                toast.error('Wallet address not found. Please connect your wallet.');
                setIsProcessing(false);
                return;
            }

            // Ensure wallet is connected
            if (!walletService.isWalletConnected()) {
                try {
                    await walletService.openWalletModal();
                } catch (error) {
                    toast.error('Failed to connect wallet');
                    setIsProcessing(false);
                    return;
                }
            }

            const receiverAddress = event.organizerAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
            const priceInStroops = Math.floor(event.price * 10000000).toString(); // Convert to stroops (1 XLM = 10,000,000 stroops)

            toast.loading('Preparing payment transaction...', { id: 'payment-toast' });
            setTransactionStarted(true);

            try {
                // Use Stellar SDK to create and submit a payment transaction
                const paymentResult = await walletService.sendPayment({
                    destination: receiverAddress,
                    amount: priceInStroops,
                    asset: 'native', // XLM
                    memo: `Ticket for event ${event.id}`
                });

                if (paymentResult && paymentResult.hash) {
                    setTransactionId(paymentResult.hash);
                    toast.success('Payment successful! Minting your ticket...', { id: 'payment-toast' });
                    setPaymentComplete(true);

                    // Mint the ticket NFT
                    const result = await handleMint(address, paymentResult.hash);
                } else {
                    throw new Error('No transaction hash returned');
                }
            } catch (requestError) {
                setError(requestError.message || 'Unknown error');

                if (requestError.message && requestError.message.includes('rejected')) {
                    toast.error('Payment canceled by user', { id: 'payment-toast' });
                } else {
                    toast.error(`Payment error: ${requestError.message || 'Unknown error'}`, { id: 'payment-toast' });
                }
                setIsProcessing(false);
                setTransactionStarted(false);
            }
        } catch (error) {
            setError(error.message || 'Unknown error');
            toast.error('Failed to process payment', { id: 'payment-toast' });
            setIsProcessing(false);
            setTransactionStarted(false);
        }
    };

    const handleMint = async (recipient, txId) => {
        try {
            toast.loading('Minting your ticket NFT...', { id: 'mint-toast' });

            const metadataURL = event.metadataUrl || `ipfs://${event.id}`;

            console.log("Enviando para mint:", {
                metadataURL,
                userPublicKey: recipient
            });

            const result = await ticketNftService.mintTicket({
                metadataURL: metadataURL,
                userPublicKey: recipient
            });

            const tokenId = result.assetCode;

            setTicketId(tokenId);
            setMetadataUri(metadataURL);



            toast.success('Ticket minted successfully!', { id: 'mint-toast' });

            if (onSuccess) {
                onSuccess({
                    ticketId: tokenId,
                    metadataUri: metadataURL,
                    transactionId: txId,
                    assetIssuer: result.issuer,
                    assetCode: result.assetCode
                });
            }

            setIsProcessing(false);
        } catch (error) {
            console.error('Mint error:', error);
            toast.error(`Failed to mint ticket: ${error.message}`, { id: 'mint-toast' });
            setIsProcessing(false);
        }
    };

    const handleManualTxId = () => {
        const txId = prompt('Please enter your transaction ID:');
        if (txId && txId.trim()) {
            setTransactionId(txId.trim());
            setPaymentComplete(true);
            handleMint(address, txId.trim());
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Your Purchase">
            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-medium text-lg mb-2">{event?.name}</h3>
                    <div className="flex justify-between text-sm">
                        <span>Price:</span>
                        <span className="font-medium">{event?.price} XLM</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {ticketId ? (
                    <div className="bg-green-50 p-4 rounded-xl">
                        <h3 className="font-medium text-green-700 mb-2">Success!</h3>
                        <p className="text-sm mb-2">
                            Your ticket has been minted and added to your wallet.
                        </p>
                        <div className="text-xs text-gray-500">
                            <div>Ticket ID: {ticketId.toString()}</div>
                            {transactionId && <div>Transaction: {transactionId}</div>}
                        </div>
                    </div>
                ) : transactionId ? (
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <h3 className="font-medium text-blue-700 mb-2">Payment Confirmed</h3>
                        <p className="text-sm mb-2">
                            Your payment has been confirmed. Minting your ticket...
                        </p>
                        <div className="text-xs text-gray-500">
                            Transaction: {transactionId}
                        </div>
                    </div>
                ) : null}

                <div className="flex flex-col space-y-3">
                    {!ticketId && (
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? 'Processing...' : 'Pay with Stellar Wallet'}
                        </button>
                    )}

                    {transactionStarted && !transactionId && (
                        <button
                            onClick={handleManualTxId}
                            className="text-sm text-primary hover:underline"
                        >
                            I've already paid. Enter transaction ID manually.
                        </button>
                    )}

                    {ticketId && (
                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}