import Reveal from "./Reveal";
import { Lock, ShieldCheck, KeyRound, DatabaseBackup, UserCog, ScrollText } from "lucide-react";

const items = [
  { icon: Lock, title: "Encrypted Data", desc: "All sensitive fleet and financial data is encrypted in transit and at rest." },
  { icon: ShieldCheck, title: "GDPR Compliant", desc: "Built to European data protection standards from day one." },
  { icon: KeyRound, title: "Secure Authentication", desc: "Enterprise-grade login with session protection and audit trails." },
  { icon: DatabaseBackup, title: "Daily Backups", desc: "Automated daily backups ensure your data is never lost." },
  { icon: UserCog, title: "Role Permissions", desc: "Granular access control for owners, admins, finance, support and drivers." },
  { icon: ScrollText, title: "Audit Logs", desc: "Every financial and admin action is tracked and fully traceable." },
];

export default function Security() {
  return (
    <section className="py-20 lg:py-28 bg-foreground text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/30 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Security & Compliance</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl mt-2 tracking-tight">
              Enterprise-grade security by default
            </h2>
            <p className="text-white/70 mt-4 text-lg">
              Your fleet's data and your drivers' earnings deserve the highest level of protection. That's non-negotiable at Songa.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 hover:border-accent/40 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1.5">{s.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}