import BlockchainBenefits from '@/components/BlockchainBenefits';
import FeatureCharities from '@/components/FeaturedCharities';
import FeaturedProjects from '@/components/FeaturedProjects';

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='hero bg-sky-600 py-16 text-white'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <h1 className='mb-6 font-bold text-5xl'>Based SEA Charity</h1>
            <p className='mb-8 text-xl'>Revolutionizing global giving through blockchain technology. Transparent, secure, and efficient donations for a better world.</p>
          </div>
        </div>
      </div>

      <FeatureCharities />
      <FeaturedProjects />
      <BlockchainBenefits />
    </div>
  );
}
