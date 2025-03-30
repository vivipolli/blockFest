import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useWallet } from '@/hooks/useWallet';
import { ipfsToHttp } from '@/utils/ipfs';
import { saveEvent } from '@/services/eventService';

export default function EventCreationForm() {
    const router = useRouter();
    const { isConnected, address } = useWallet();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [eventData, setEventData] = useState({
        id: Date.now().toString(),
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'DeFi',
        price: '0',
        isPaid: false,
        spotsAvailable: '100',
        organizer: {
            name: '',
            id: address || '',
            wallet: address || ''
        },
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        ticketType: 'Standard',
        totalSupply: '100',
        mintPrice: '0',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Load user profile data from localStorage when component mounts
    useEffect(() => {
        const savedProfileData = localStorage.getItem('user_profile_data');
        if (savedProfileData) {
            const profileData = JSON.parse(savedProfileData);
            setEventData(prevData => ({
                ...prevData,
                organizer: {
                    ...prevData.organizer,
                    name: profileData.name || 'Anonymous',
                    id: address || '',
                    wallet: address || ''
                }
            }));
        }
    }, [address]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'number') {
            const numValue = value === '' ? '0' : value;
            if (name === 'price') {
                const isPaid = parseFloat(numValue) > 0;
                setEventData({
                    ...eventData,
                    [name]: numValue,
                    isPaid
                });
            } else {
                setEventData({
                    ...eventData,
                    [name]: numValue
                });
            }
        } else if (type === 'checkbox') {
            setEventData({
                ...eventData,
                [name]: checked
            });
        } else if (name.startsWith('organizer.')) {
            const organizerField = name.split('.')[1];
            setEventData({
                ...eventData,
                organizer: {
                    ...eventData.organizer,
                    [organizerField]: value
                }
            });
        } else {
            setEventData({
                ...eventData,
                [name]: value
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        toast.loading('Creating event and uploading to IPFS...', { id: 'event-creation' });

        try {
            const formData = new FormData();

            // Use mock image if no image is selected
            if (!image) {
                const response = await fetch('/event1.png');
                const blob = await response.blob();
                const mockImage = new File([blob], 'event1.png', { type: 'image/png' });
                formData.append('image', mockImage);
            } else {
                formData.append('image', image);
            }

            const completeEventData = {
                ...eventData,
                datetime: `${eventData.date}T${eventData.time}`,
                properties: {
                    eventId: eventData.id.toString(),
                    eventType: 'NFT Ticket',
                    venue: eventData.location,
                    ticketType: eventData.ticketType,
                    maxSupply: eventData.totalSupply,
                    mintPrice: eventData.price,
                    blockchain: 'Stacks',
                    standard: 'SIP-009',
                    createdAt: eventData.createdAt
                },
                attributes: [
                    { trait_type: 'Event Date', value: eventData.date },
                    { trait_type: 'Event Time', value: eventData.time },
                    { trait_type: 'Location', value: eventData.location },
                    { trait_type: 'Category', value: eventData.category },
                    { trait_type: 'Price', value: eventData.price.toString() },
                    { trait_type: 'Ticket Type', value: eventData.ticketType },
                    { trait_type: 'Status', value: eventData.status },
                    { trait_type: 'Available Spots', value: eventData.spotsAvailable.toString() }
                ]
            };

            formData.append('eventData', JSON.stringify(completeEventData));

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create event');
            }

            const data = await response.json();

            if (data.success) {
                const savedEvent = await saveEvent(
                    completeEventData,
                    data.metadataUrl,
                    data.imageUrl
                );

                toast.success('Event created successfully!', { id: 'event-creation' });
                router.push(`/events/${savedEvent.id}`);
            }

        } catch (error) {
            console.error('Error creating event:', error);
            toast.error(`Failed to create event: ${error.message}`, { id: 'event-creation' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
                        Event Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={eventData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300"
                        required
                    />
                </div>

                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={eventData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={eventData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                     focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                     hover:border-primary/50 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
                            Time
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={eventData.time}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                     focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                     hover:border-primary/50 transition-all duration-300"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={eventData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                    />
                </div>

                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
                        Category
                    </label>
                    <select
                        name="category"
                        value={eventData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300"
                        required
                    >
                        <option value="DeFi">DeFi</option>
                        <option value="NFTs">NFTs & Digital Art</option>
                        <option value="DAOs">DAOs & Governance</option>
                        <option value="Blockchain">Blockchain Development</option>
                        <option value="Metaverse">Metaverse & Gaming</option>
                        <option value="Web3">Web3 & dApps</option>
                        <option value="Crypto">Cryptocurrency</option>
                        <option value="Security">Security & Privacy</option>
                        <option value="Community">Community & Social</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
                        Price (STX)
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={eventData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                 focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300"
                        required
                    />
                    <p className="mt-2 text-sm text-gray-500">Set to 0 for free events</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Spots
                    </label>
                    <input
                        type="number"
                        name="spotsAvailable"
                        value={eventData.spotsAvailable}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                    />
                </div>

                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
                        Event Image
                    </label>
                    <div className="mt-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                     focus:ring-2 focus:ring-primary/20 focus:border-primary 
                                     hover:border-primary/50 transition-all duration-300"

                        />
                    </div>
                    {imagePreview && (
                        <div className="mt-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl"></div>
                            <img
                                src={imagePreview}
                                alt="Event preview"
                                className="w-full h-48 object-cover rounded-xl"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={` cursor-pointer px-8 py-3 bg-primary text-white rounded-xl 
                              hover:bg-primary-dark transition-all duration-300 
                              hover:box-glow-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                >
                    {isSubmitting ? 'Creating Event...' : 'Create Event'}
                </button>
            </div>
        </form>
    );
} 