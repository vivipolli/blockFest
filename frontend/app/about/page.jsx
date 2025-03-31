import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// FAQ Component
const FAQItem = ({ question, answer }) => {
    return (
        <div className="border-b border-gray-200 py-6">
            <h3 className="text-xl font-semibold mb-3">{question}</h3>
            <p className="text-gray-600">{answer}</p>
        </div>
    );
};

export default function AboutPage() {
    // FAQ data
    const faqs = [
        {
            question: "What is BlockFest?",
            answer: "BlockFest is a Web3 platform that revolutionizes event management and attendance through blockchain technology. We provide a seamless way for organizers to create events with NFT tickets and certificates, while attendees can collect and showcase their event experiences as digital assets."
        },
        {
            question: "How do NFT tickets work?",
            answer: "NFT tickets are unique digital assets stored on the blockchain. When you purchase a ticket, you receive an NFT that serves as your entry pass. This NFT can also function as a collectible, proof of attendance, and may include special perks or access determined by the event organizer."
        },
        {
            question: "Do I need a crypto wallet to use BlockFest?",
            answer: "Yes, you'll need a compatible crypto wallet to interact with our platform. We support various wallets including MetaMask, Hiro Wallet, and others. The wallet allows you to purchase tickets, store your NFTs, and interact with the blockchain aspects of our platform."
        },
        {
            question: "Can I resell my NFT tickets?",
            answer: "Yes, one of the benefits of NFT tickets is that they can be transferred or resold. However, event organizers may set specific rules or royalties for secondary sales. All transactions are transparent on the blockchain, reducing fraud and unauthorized reselling."
        },
        {
            question: "What blockchain does BlockFest use?",
            answer: "BlockFest is built on the Stacks blockchain, which provides security, scalability, and low transaction costs while leveraging Bitcoin's security. This ensures your digital assets are secure and transactions are reliable."
        },
        {
            question: "How do I create an event as an organizer?",
            answer: "To create an event, you need to connect your wallet, register as an organizer, and use our intuitive event creation interface. You can customize your event details, ticket types, pricing, and special NFT features. Our platform handles the blockchain integration, making it easy even for those new to Web3."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">About BlockFest</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Revolutionizing the event industry with blockchain technology and NFTs,
                        creating unforgettable experiences and lasting digital memories.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <p className="text-gray-600 mb-6">
                                At BlockFest, we're on a mission to transform how people experience events in the digital age.
                                By leveraging blockchain technology, we're creating a more transparent, secure, and
                                engaging platform for event organizers and attendees alike.
                            </p>
                            <p className="text-gray-600">
                                We believe that events are more than just moments in time—they're experiences that
                                deserve to be remembered and valued. Through our innovative use of NFTs, we're
                                enabling a new way to capture, authenticate, and share these experiences.
                            </p>
                        </div>
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <div className="relative h-80 w-full">
                                <Image
                                    src="/event1.png"
                                    alt="BlockFest Mission"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Have questions or want to learn more about BlockFest? We'd love to hear from you!
                    </p>
                    <Link
                        href="/contact"
                        className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors font-medium"
                    >
                        Contact Us
                    </Link>
                </div>
            </section>
        </div>
    );
} 