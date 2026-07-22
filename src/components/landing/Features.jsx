import Reveal from "./Reveal";
import { Upload, CalendarClock, LayoutDashboard, ShieldCheck, FileText, Lock, Bell, Smartphone, Globe, ScanLine, KeyRound, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { icon: Upload, title: "CSV Upload Processing", desc: "Drag-and-drop weekly earnings files and process hundreds of drivers in seconds.", span: "lg:col-span-2" },
  { icon: CalendarClock, title: "Weekly Settlements", desc: "Automated commission and payout calculations every cycle." },
  { icon: LayoutDashboard, title: "Finance Dashboard", desc: "Track pending and paid payouts with live totals.", span: "lg:col-span-2" },
  { icon: ShieldCheck, title: "Admin Dashboard", desc: "Full operational control for owners and admins." },
  { icon: FileText, title: "Driver Portal", desc: "Drivers view earnings and download PDF statements." },
  { icon: Lock, title: "Role Permissions", desc: "Granular access for owners, finance, support and drivers." },
  { icon: ClipboardList, title: "Audit Logs", desc: "Every financial and admin action is tracked and traceable.", span: "lg:col-span-2" },
  { icon: Bell, title: "Notifications", desc: "Stay informed on payouts and settlements." },
  { icon: Smartphone, title: "Responsive Dashboard", desc: "Manage your fleet from any device, anywhere." },
  { icon: Globe, title: "GDPR Compliance", desc: "Built to European data protection standards." },
  { icon: KeyRound, title: "Secure Authentication", desc: "Enterprise-grade login and session security.", span: "lg:col-span-2" },
];

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-white border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Platform Features</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              A platform engineered for fleet finance
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Every feature is designed to remove manual work and give you total visibility over your operations.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.05} className={cn(f.span)}>
              <div className="group h-full bg-gradient-to-b from-background to-white rounded-2xl border border-border/60 p-6 hover:shadow-premium hover:border-primary/20 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}