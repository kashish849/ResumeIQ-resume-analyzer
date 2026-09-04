import Navbar from '../components/landing/Navbar.jsx';
import Hero from '../components/landing/Hero.jsx';
import TrustStats from '../components/landing/TrustStats.jsx';
import Features from '../components/landing/Features.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import AtsExplainer from '../components/landing/AtsExplainer.jsx';
import JobMatchDemo from '../components/landing/JobMatchDemo.jsx';
import Testimonials from '../components/landing/Testimonials.jsx';
import Pricing from '../components/landing/Pricing.jsx';
import Faq from '../components/landing/Faq.jsx';
import FinalCta from '../components/landing/FinalCta.jsx';
import Footer from '../components/landing/Footer.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <Hero />
      <TrustStats />
      <Features />
      <HowItWorks />
      <AtsExplainer />
      <JobMatchDemo />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}
