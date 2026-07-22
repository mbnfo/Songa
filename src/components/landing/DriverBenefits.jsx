import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

const benefits = [
  "Weekly Settlements",
  "Transparent Earnings",
  "Dedicated Support",
  "Professional Fleet Management",
  "Easy Driver Dashboard",
  "Secure Statements",
  "Growth Opportunities",
];

export default function DriverBenefits() {
  return (
    <section id="benefits" className="py-20 lg:py-28 bg-white border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Driver Benefits</span>
              <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
                Built for drivers, every step of the way
              </h2>
              <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
                Songa gives you the tools, transparency and support to run a successful driving business — without the admin headaches.
              </p>
              <Link to="/register" className="group inline-flex items-center gap-2 mt-8 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3.5 rounded-full transition-all hover:shadow-float hover:-translate-y-0.5">
                Join Our Fleet
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <div
                  key={b}
                  className={`flex items-center gap-3 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.03] to-transparent px-5 py-4 hover:shadow-premium hover:-translate-y-0.5 transition-all ${i === benefits.length - 1 ? "sm:col-span-2" : ""}`}
                >
                  <span className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="font-heading font-semibold text-foreground">{b}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}