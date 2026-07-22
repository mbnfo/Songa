import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function CTA() {
  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary px-6 py-16 lg:py-20 text-center text-white shadow-float">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/30 rounded-full blur-[100px] animate-pulse-glow" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-[100px]" />

            <div className="relative">
              <h2 className="font-heading font-extrabold text-3xl lg:text-5xl tracking-tight max-w-2xl mx-auto leading-tight">
                Ready to Join the Songa Fleet?
              </h2>
              <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto">
                Take the next step towards smarter fleet management and reliable weekly earnings.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link to="/register" className="group inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3.5 rounded-full hover:bg-white/90 transition-all hover:-translate-y-0.5 shadow-float">
                  Register as a Driver <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a href="#contact" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-white/20 transition-all hover:-translate-y-0.5">
                  <MessageCircle className="w-4 h-4" /> Contact Our Team
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}