import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import FeaturedProviders from "../components/FeaturedProviders";
import CTABanner from "../components/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedProviders />
      <CTABanner />
    </>
  );
}
