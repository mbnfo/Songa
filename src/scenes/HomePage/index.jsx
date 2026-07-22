import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import TrustedBy from "../../components/landing/TrustedBy";
import About from "../../components/landing/About";
import WhyChoose from "../../components/landing/WhyChoose";
import HowItWorks from "../../components/landing/HowItWorks";
import Testimonials from "../../components/landing/Testimonials";
import DriverBenefits from "../../components/landing/DriverBenefits";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";


export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <About />
        <WhyChoose />
        <HowItWorks />
        <Testimonials />
        <DriverBenefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}