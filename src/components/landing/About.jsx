import Reveal from "./Reveal";
import { Target, Eye } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Who We Are */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Who We Are</span>
              <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
                More than a fleet company — a technology partner
              </h2>
              <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
                Songa is a technology-driven fleet management company helping ride-hailing and delivery drivers maximise their earnings while simplifying fleet operations.
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                We combine modern software, transparent weekly settlements and dedicated support to give drivers the tools they need to build sustainable, profitable businesses on the road.
              </p>
              <div className="mt-8 flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="font-heading font-extrabold text-2xl text-foreground">500+</p>
                  <p className="text-muted-foreground">Active Drivers</p>
                </div>
                <div className="w-px bg-border/60" />
                <div>
                  <p className="font-heading font-extrabold text-2xl text-foreground">12K+</p>
                  <p className="text-muted-foreground">Weekly Trips</p>
                </div>
                <div className="w-px bg-border/60" />
                <div>
                  <p className="font-heading font-extrabold text-2xl text-foreground">99.9%</p>
                  <p className="text-muted-foreground">Uptime</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-float aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&h=700&fit=crop"
                  alt="Professional drivers and fleet vehicles"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden sm:block bg-white rounded-2xl shadow-premium p-4 border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center"><Target className="w-5 h-5" /></div>
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">Driver-First</p>
                    <p className="text-xs text-muted-foreground">Built around your earnings</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mt-20">
          <Reveal>
            <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/[0.04] to-transparent p-8 h-full hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-5"><Target className="w-6 h-6" /></div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower ride-hailing and delivery drivers with reliable fleet management, transparent earnings, and technology that helps them grow sustainable businesses.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-accent/[0.04] to-transparent p-8 h-full hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center mb-5"><Eye className="w-6 h-6" /></div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the most trusted fleet management platform for professional drivers across Europe by combining technology, transparency, and exceptional service.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}