    import Reveal from "./Reveal";
import { UserPlus, BadgeCheck, Car, BarChart3, ArrowDown } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Sign Up", desc: "Complete a quick online application to join the Songa fleet." },
  { icon: BadgeCheck, title: "Get Approved", desc: "Submit required documentation and join our fleet as an approved driver." },
  { icon: Car, title: "Start Driving", desc: "Begin earning through our partner ride-hailing and delivery platforms." },
  { icon: BarChart3, title: "Track Earnings", desc: "Monitor weekly income and download statements from your driver dashboard." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">How It Works</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              From sign-up to earnings in four steps
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              A clear, simple path to joining Songa and starting your journey as a professional driver.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="relative text-center px-2">
                <div className="relative w-16 h-16 mx-auto rounded-2xl bg-white border border-border/60 shadow-premium flex items-center justify-center text-primary mb-5">
                  <s.icon className="w-7 h-7" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowDown className="hidden lg:block w-6 h-6 text-border absolute top-6 -right-3 rotate-[-90deg]" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}