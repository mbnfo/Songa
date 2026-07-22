import Reveal from "./Reveal";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    desc: "For small fleets getting started with automated settlements.",
    price: "199",
    period: "PLN / month",
    features: ["Up to 25 drivers", "Weekly CSV processing", "Driver portal & statements", "Finance dashboard", "Email support"],
    featured: false,
  },
  {
    name: "Professional",
    desc: "For growing fleets that need full operational control.",
    price: "499",
    period: "PLN / month",
    features: ["Up to 150 drivers", "Everything in Starter", "Advanced analytics", "Role-based access", "Audit logs", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    desc: "For large fleets with custom operational needs.",
    price: "Custom",
    period: "tailored to you",
    features: ["Unlimited drivers", "Everything in Professional", "Dedicated account manager", "Custom integrations", "SLA & 24/7 support", "Onboarding assistance"],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Pricing</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              Simple, scalable pricing for every fleet
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Start small, scale as you grow. No setup fees, cancel anytime.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className={cn(
                "relative rounded-3xl p-7 h-full transition-all duration-300",
                t.featured
                  ? "bg-gradient-to-br from-primary to-secondary text-white shadow-float lg:-translate-y-4 border border-primary/30"
                  : "bg-white border border-border/60 hover:shadow-premium hover:-translate-y-1"
              )}>
                {t.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-float">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                )}
                <h3 className={cn("font-heading font-bold text-xl", t.featured ? "text-white" : "text-foreground")}>{t.name}</h3>
                <p className={cn("text-sm mt-2", t.featured ? "text-white/80" : "text-muted-foreground")}>{t.desc}</p>
                <div className="mt-5 flex items-end gap-2">
                  <span className={cn("font-heading font-extrabold text-4xl tracking-tight", t.featured ? "text-white" : "text-foreground")}>{t.price}</span>
                  <span className={cn("text-sm mb-1", t.featured ? "text-white/70" : "text-muted-foreground")}>{t.period}</span>
                </div>
                <a href="#contact" className={cn(
                  "mt-6 w-full inline-flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-full transition-all",
                  t.featured ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90"
                )}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
                <ul className="mt-7 space-y-3">
                  {t.features.map(f => (
                    <li key={f} className={cn("flex items-center gap-2.5 text-sm", t.featured ? "text-white/90" : "text-muted-foreground")}>
                      <span className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", t.featured ? "bg-accent text-white" : "bg-accent/10 text-accent")}>
                        <Check className="w-3 h-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}