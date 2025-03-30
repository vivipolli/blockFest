'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-hot-toast';

export default function ShareModal({ isOpen, onClose, event }) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState('');

    const handleShare = async () => {
        try {
            toast.success('Event shared successfully!');
            onClose();
        } catch (error) {
            console.error('Share error:', error);
            toast.error('Failed to share event');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 space-y-6">
                <h3 className="text-xl font-bold">Share with Followers</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add a message (optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            rows="3"
                            placeholder="Write a message to your followers..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select followers
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {['Alice', 'Bob', 'Charlie'].map((follower) => (
                                <label
                                    key={follower}
                                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(follower)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedUsers([...selectedUsers, follower]);
                                            } else {
                                                setSelectedUsers(selectedUsers.filter(u => u !== follower));
                                            }
                                        }}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-sm font-medium">
                                                {follower[0]}
                                            </span>
                                        </div>
                                        <span className="font-medium">{follower}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={selectedUsers.length === 0}
                        className={`px-6 py-2 bg-primary text-white rounded-xl transition-colors
                            ${selectedUsers.length === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-primary-dark'}`}
                    >
                        Share
                    </button>
                </div>
            </div>
        </Modal>
    );
} 