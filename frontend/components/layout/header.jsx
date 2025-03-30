'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { address, isConnected, connect, disconnect } = useWallet()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const truncateAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="w-full py-4 px-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative mr-2">
              <Image
                src="/logo.png"
                alt="Event3 Logo"
                width={140}
                height={140}
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/events"
            className="text-foreground hover:text-primary transition-colors"
          >
            Events
          </Link>
          <Link
            href="/marketplace"
            className="text-foreground hover:text-secondary transition-colors"
          >
            NFT Marketplace
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-accent transition-colors"
          >
            About Us
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isConnected ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/5 rounded-full border border-secondary/10 hover:bg-secondary/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-sm font-medium text-secondary">
                  {truncateAddress(address)}
                </span>
              </div>
              <button
                onClick={disconnect}
                className="px-4 py-2 text-foreground hover:text-primary transition-colors"
              >
                Disconnect
              </button>
              <Link
                href="/my-profile"
                className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
              >
                My Profile
              </Link>
            </>
          ) : (
            <button
              onClick={connect}
              className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-lg animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/events"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/marketplace"
              className="text-foreground hover:text-secondary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              NFT Marketplace
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              {isConnected ? (
                <>
                  <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-secondary/5 rounded-full border border-secondary/10 mx-auto">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-sm font-medium text-secondary">
                      {truncateAddress(address)}
                    </span>
                  </div>
                  <button
                    onClick={disconnect}
                    className="text-center py-2 text-foreground hover:text-primary transition-colors"
                  >
                    Disconnect
                  </button>
                  <Link
                    href="/my-profile"
                    className="text-center px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <button
                  onClick={connect}
                  className="text-center px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
