import HeroSection from '../components/home/HeroSection'
import SuggestedListings from '../components/home/SuggestedListings'
import CategoriesSection from '../components/home/CategoriesSection'
import HowItWorks from '../components/home/HowItWorks'
import AiPromoSection from '../components/home/AiPromoSection'
import WhyChoose from '../components/home/WhyChoose'
import PopularLocations from '../components/home/PopularLocations'
import OwnerBenefits from '../components/home/OwnerBenefits'
import GamificationPreview from '../components/home/GamificationPreview'
import FaqSection from '../components/home/FaqSection'
import CtaSection from '../components/home/CtaSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <SuggestedListings />
      <CategoriesSection />
      <HowItWorks />
      <AiPromoSection />
      <WhyChoose />
      <PopularLocations />
      <OwnerBenefits />
      <GamificationPreview />
      <FaqSection />
      <CtaSection />
    </>
  )
}