import Reveal from "./Reveal";
import AnimatedCounter from "./AnimatedCounter";
import { Users, Activity, Wallet, Smile, Award } from "lucide-react";

const stats = [
  { icon: Users, to: 500, suffix: "+", label: "Drivers Managed" },
  { icon: Activity, to: 99.9, suffix: "%", decimals: 1, label: "System Uptime" },
  { icon: Wallet, to: 1, prefix: "", suffix: "M+ PLN", label: "Driver Earnings Processed" },
  { icon: Smile, to: 98, suffix: "%", label: "Customer Satisfaction" },
  { icon: Award, to: 5, suffix: "+", label: "Years Experience" },
];

export default function Stats() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-border/60 shadow-premium flex items-center justify-center mb-4 group-hover:scale-105 group-hover:shadow-float transition-all">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground tracking-tight">
                  <AnimatedCounter to={s.to} suffix={s.suffix} prefix={s.prefix} decimals={s.decimals || 0} />
                </p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}