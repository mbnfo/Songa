import Reveal from "./Reveal";
import AnimatedCounter from "./AnimatedCounter";
import { Users, Activity, Zap, ShieldCheck, Wallet, Headphones, Lock } from "lucide-react";

const stats = [
  { icon: Users, to: 500, suffix: "+", label: "Drivers Supported" },
  { icon: Zap, to: 12000, suffix: "+", label: "Weekly Trips" },
  { icon: Wallet, to: 7, suffix: " days", label: "Weekly Settlements" },
  { icon: Activity, to: 99.9, suffix: "%", decimals: 1, label: "Platform Reliability" },
];

const badges = [
  { icon: Lock, label: "Secure Platform" },
  { icon: Wallet, label: "Weekly Payments" },
  { icon: Headphones, label: "Professional Support" },
  { icon: ShieldCheck, label: "GDPR Compliant" },
];

export default function TrustedBy() {
  return (
    <section className="py-16 lg:py-20 border-y border-border/60 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-10">
            Trusted by Professional Drivers
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-12">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-center group">
                <div className="w-11 h-11 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground tracking-tight">
                  <AnimatedCounter to={s.to} suffix={s.suffix} decimals={s.decimals || 0} />
                </p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-8 border-t border-border/60">
            {badges.map(b => (
              <span key={b.label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <b.icon className="w-4 h-4 text-accent" />
                {b.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}