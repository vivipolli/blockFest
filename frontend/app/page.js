import Hero from '@/components/home/hero'
import TrendingEvents from '@/components/home/trending-events'
import FeaturedNFTs from '@/components/home/featured-nfts'
import PlatformFeatures from '@/components/home/platform-features'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TrendingEvents />
      <FeaturedNFTs />
      <PlatformFeatures />
    </div>
  )
}
