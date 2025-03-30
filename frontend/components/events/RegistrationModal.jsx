'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

export default function RegistrationModal({ isOpen, onClose, event, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Failed to complete registration');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h3 className="text-xl font-bold mb-4">Event Registration</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                    Complete Registration
                </button>
            </form>
        </Modal>
    );
} 