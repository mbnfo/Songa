import Reveal from "./Reveal";
import { Wallet, Banknote, Headphones, LayoutDashboard, ShieldCheck, TrendingUp } from "lucide-react";

const features = [
  { icon: Wallet, title: "Weekly Earnings Management", desc: "Transparent earnings and settlement tracking — always know exactly what you've earned." },
  { icon: Banknote, title: "Reliable Weekly Payouts", desc: "Fast and dependable payment processing, so you get paid on time, every week." },
  { icon: Headphones, title: "Driver Support", desc: "Dedicated assistance whenever you need help, from onboarding to weekly statements." },
  { icon: LayoutDashboard, title: "Fleet Technology", desc: "Modern dashboards and reporting that give you real-time insight into your performance." },
  { icon: ShieldCheck, title: "Secure Platform", desc: "Your information is protected using industry best practices and GDPR compliance." },
  { icon: TrendingUp, title: "Growth Focused", desc: "Helping drivers earn more while reducing administrative work and overhead." },
];

export default function WhyChoose() {
  return (
    <section id="why" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why Choose Songa</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              Everything you need to succeed on the road
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Six reasons professional drivers choose Songa to manage their fleet and earnings.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <div className="group h-full bg-white rounded-3xl border border-border/60 p-7 hover:shadow-float hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}