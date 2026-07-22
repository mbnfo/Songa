import Reveal from "./Reveal";
import { TrendingUp, Clock, Zap, Smile } from "lucide-react";

const studies = [
  {
    icon: TrendingUp,
    value: "+42%",
    label: "Operational Efficiency",
    desc: "A 90-vehicle Warsaw fleet cut weekly admin time from 14 hours to 6 after switching to Songa.",
    color: "from-primary to-secondary",
  },
  {
    icon: Clock,
    value: "-68%",
    label: "Reduction in Admin Work",
    desc: "Automated CSV processing and settlements removed two full days of manual finance work every week.",
    color: "from-accent to-chart-2",
  },
  {
    icon: Zap,
    value: "3 min",
    label: "Faster Payouts",
    desc: "Weekly payouts that took a full day now settle in minutes, with drivers paid the same day.",
    color: "from-chart-4 to-chart-5",
  },
];

export default function CaseStudies() {
  return (
    <section className="py-20 lg:py-28 bg-white border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Case Studies</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              Results that speak for themselves
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Measurable improvements delivered to fleets operating on Songa.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {studies.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="group relative h-full rounded-3xl border border-border/60 overflow-hidden bg-gradient-to-br from-background to-white p-7 hover:shadow-float transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 shadow-sm`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-heading font-extrabold text-4xl text-foreground tracking-tight">{s.value}</p>
                <p className="text-sm font-semibold text-primary mt-1">{s.label}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{s.desc}</p>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary/5 group-hover:scale-150 transition-transform duration-700" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}