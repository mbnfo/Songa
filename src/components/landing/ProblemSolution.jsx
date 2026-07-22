import Reveal from "./Reveal";
import { X, Check, Calculator, Clock, Sheet, EyeOff, FileStack, Zap, LayoutDashboard, BarChart3, FileText, ShieldCheck, UserCog } from "lucide-react";

const problems = [
  { icon: Calculator, text: "Manual calculations for every driver" },
  { icon: Clock, text: "Late and inconsistent payouts" },
  { icon: Sheet, text: "Spreadsheet chaos across teams" },
  { icon: EyeOff, text: "Poor visibility into fleet performance" },
  { icon: FileStack, text: "Administrative overload and paperwork" },
];

const solutions = [
  { icon: Zap, text: "Automated weekly settlements" },
  { icon: LayoutDashboard, text: "Self-service driver dashboard" },
  { icon: BarChart3, text: "Real-time financial reporting" },
  { icon: FileText, text: "Instant PDF driver statements" },
  { icon: ShieldCheck, text: "Role-based access and audit logs" },
  { icon: UserCog, text: "Centralised admin management" },
];

export default function ProblemSolution() {
  return (
    <section className="py-20 lg:py-28 bg-white border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">The Problem</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              Fleet operations shouldn't run on spreadsheets
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Managing a growing fleet manually costs you time, money, and trust. Songa replaces the chaos with one intelligent platform.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Problems */}
          <Reveal>
            <div className="rounded-3xl border border-red-100 bg-red-50/40 p-7 lg:p-8 h-full">
              <h3 className="font-heading font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"><X className="w-4 h-4" /></span>
                Common Fleet Problems
              </h3>
              <ul className="space-y-4">
                {problems.map(p => (
                  <li key={p.text} className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-10 h-10 rounded-xl bg-white border border-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
                      <p.icon className="w-5 h-5" />
                    </span>
                    <span className="font-medium">{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Solutions */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-accent/30 bg-accent/5 p-7 lg:p-8 h-full shadow-premium">
              <h3 className="font-heading font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center"><Check className="w-4 h-4" /></span>
                How Songa Solves Them
              </h3>
              <ul className="space-y-4">
                {solutions.map(s => (
                  <li key={s.text} className="flex items-center gap-3 text-foreground">
                    <span className="w-10 h-10 rounded-xl bg-white border border-accent/30 flex items-center justify-center text-accent flex-shrink-0">
                      <s.icon className="w-5 h-5" />
                    </span>
                    <span className="font-medium">{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}