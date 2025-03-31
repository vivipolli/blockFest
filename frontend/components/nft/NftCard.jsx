import { useState, useEffect } from 'react';
import Image from 'next/image';
import { convertIpfsUrl } from '@/utils/ipfs';

export default function NftCard({ tokenUri, tx_id, metadata }) {
    const [nftData, setNftData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadNftData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (metadata) {
                    let imageUrl = metadata.image;
                    if (imageUrl) {
                        imageUrl = convertIpfsUrl(imageUrl);
                    }

                    setNftData({
                        name: metadata.name,
                        image: imageUrl,
                        description: metadata.description
                    });
                    setLoading(false);
                    return;
                }

                if (!tokenUri) {
                    throw new Error('No token URI or metadata provided');
                }

                const response = await fetch(tokenUri);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const nftMetadata = await response.json();
                let imageUrl = nftMetadata.image;
                if (imageUrl) {
                    imageUrl = convertIpfsUrl(imageUrl);
                }

                setNftData({
                    name: nftMetadata.name,
                    image: imageUrl,
                    description: nftMetadata.description
                });
                setLoading(false);
            } catch (error) {
                console.error('Error loading NFT:', error);
                setError('Failed to load NFT');
                setLoading(false);
            }
        };

        loadNftData();
    }, [tokenUri, metadata]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 h-64 flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="relative h-48 w-full bg-gray-100">
                {nftData?.image ? (
                    <Image
                        src={nftData.image}
                        alt={nftData.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold mb-3">{nftData?.name || 'Unnamed NFT'}</h3>
                {nftData?.description && (
                    <p className="text-sm text-gray-600 mb-3">{nftData.description}</p>
                )}
            </div>
        </div>
    );
} 