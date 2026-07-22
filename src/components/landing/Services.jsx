import Reveal from "./Reveal";
import { Truck, Users, Wallet, BarChart3, FileText, MapPin, TrendingUp, Headphones, ArrowRight } from "lucide-react";

const services = [
  { icon: Truck, title: "Fleet Management", desc: "Centralise every vehicle, driver and document in one operations hub built for scale.", color: "from-primary to-secondary" },
  { icon: Users, title: "Driver Management", desc: "Onboard, track and manage drivers with self-service portals and role-based access.", color: "from-secondary to-chart-4" },
  { icon: Wallet, title: "Weekly Earnings Processing", desc: "Upload a CSV and let Songa calculate commissions, deductions and net payouts automatically.", color: "from-accent to-chart-2" },
  { icon: BarChart3, title: "Financial Reporting", desc: "Real-time dashboards turn raw trip data into clear financial insight for owners.", color: "from-chart-4 to-chart-5" },
  { icon: FileText, title: "Driver Statements", desc: "Generate branded PDF statements drivers can download anytime, instantly.", color: "from-chart-1 to-chart-3" },
  { icon: MapPin, title: "Vehicle Tracking", desc: "Monitor vehicle status, service schedules and availability across your entire fleet.", color: "from-primary to-chart-3" },
  { icon: TrendingUp, title: "Business Analytics", desc: "Identify your best-performing drivers, routes and weeks with actionable analytics.", color: "from-chart-5 to-accent" },
  { icon: Headphones, title: "Support Services", desc: "Dedicated onboarding and ongoing support from a team that knows fleet operations.", color: "from-secondary to-primary" },
];

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Services</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              Everything your fleet needs to operate at scale
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              A complete platform that handles the operations, finance and compliance of modern ride-hailing and delivery fleets.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 4) * 0.06}>
              <div className="group h-full bg-white rounded-2xl border border-border/60 p-6 hover:shadow-float hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}