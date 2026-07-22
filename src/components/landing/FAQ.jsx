
import { useState } from "react";
import Reveal from "./Reveal";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How do drivers register on Songa?", a: "Drivers create a portal account through a simple onboarding flow. Once an admin uploads their weekly earnings CSV, the driver instantly sees their earnings, commission breakdown and net payout in their dashboard." },
  { q: "How are weekly payouts processed?", a: "Admins upload a weekly CSV with driver earnings. Songa automatically calculates commission, deductions and net payouts. The finance team then reviews and marks payouts as paid — all in one click." },
  { q: "What format should the CSV upload be?", a: "The CSV requires at least a driver name and gross earnings column. Optional columns include trips, tips, bonuses, deductions and a per-driver commission rate. A default commission rate is applied when not specified." },
  { q: "Can drivers download their earnings statements?", a: "Yes. Every weekly earning record can be downloaded as a branded PDF statement directly from the driver portal, including the full earnings breakdown and payout status." },
  { q: "How is my fleet's data secured?", a: "All data is encrypted in transit and at rest. Songa is GDPR compliant, uses secure authentication, performs daily backups, and logs every financial and admin action through audit logs with role-based access control." },
  { q: "What support is included?", a: "Starter and Professional plans include email support, with priority support on Professional. Enterprise customers get a dedicated account manager, custom integrations, SLA coverage and 24/7 support." },
  { q: "Can I change plans as my fleet grows?", a: "Absolutely. You can upgrade or downgrade your plan at any time. Pricing scales with the number of drivers you manage, so you only pay for what you need." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-20 lg:py-28 bg-white border-y border-border/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              Questions, answered
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Everything you need to know about running your fleet on Songa.
            </p>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className={cn(
                "rounded-2xl border transition-all",
                open === i ? "border-primary/30 shadow-premium bg-white" : "border-border/60 bg-white hover:border-border"
              )}>
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-heading font-semibold text-foreground">{f.q}</span>
                  <span className={cn("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all", open === i ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", open === i && "rotate-180")} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}