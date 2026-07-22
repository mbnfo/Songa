import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Wallet, CheckCircle } from "lucide-react";

function MiniBar({ height, delay }) {
  return (
    <motion.div
      initial={{ height: 0 }}
      whileInView={{ height }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="w-7 rounded-t-md bg-gradient-to-t from-primary/40 to-primary"
    />
  );
}

export default function HeroDashboard() {
  return (
    <div className="relative w-full">
      {/* Main dashboard card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl shadow-float border border-border/60 overflow-hidden"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-muted/40">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="ml-3 text-[11px] text-muted-foreground font-medium">app.songafleet.com/dashboard</div>
        </div>

        <div className="p-5 grid grid-cols-3 gap-4">
          {/* Stat cards */}
          <div className="col-span-3 grid grid-cols-3 gap-3">
            {[
              { icon: Wallet, label: "Weekly Earnings", value: "£48,920", trend: "+12.4%", up: true, color: "bg-primary/10 text-primary" },
              { icon: Users, label: "Active Drivers", value: "127", trend: "+8", up: true, color: "bg-accent/10 text-accent" },
              { icon: CheckCircle, label: "Settlements", value: "96%", trend: "On time", up: true, color: "bg-violet-100 text-violet-600" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border/60 p-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color} mb-2`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                <p className="text-base font-bold text-foreground">{s.value}</p>
                <div className="flex items-center gap-1 text-[10px] text-accent font-medium">
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.trend}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="col-span-2 rounded-xl border border-border/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Earnings Overview</p>
                <p className="text-[10px] text-muted-foreground">Last 7 days</p>
              </div>
              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">Live</span>
            </div>
            <div className="flex items-end gap-2 h-24">
              <MiniBar height={40} delay={0.1} />
              <MiniBar height={65} delay={0.18} />
              <MiniBar height={50} delay={0.26} />
              <MiniBar height={80} delay={0.34} />
              <MiniBar height={95} delay={0.42} />
              <MiniBar height={70} delay={0.5} />
              <MiniBar height={88} delay={0.58} />
            </div>
          </div>

          {/* Driver list */}
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs font-semibold text-foreground mb-3">Top Drivers</p>
            <div className="space-y-2.5">
              {[
                { n: "James W.", v: "£1,850" },
                { n: "Sarah C.", v: "£1,620" },
                { n: "Michael O.", v: "£1,980" },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-[9px] font-bold flex items-center justify-center">
                    {d.n.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium text-foreground truncate">{d.n}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-accent">{d.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating card 1 — payout */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="absolute -left-6 sm:-left-10 top-1/3 bg-white rounded-xl shadow-float border border-border/60 p-3.5 w-44 animate-float"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground font-medium">Payout Approved</p>
            <p className="text-xs font-bold text-foreground">£3,240.00</p>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.2, delay: 0.8 }} className="h-full bg-gradient-to-r from-primary to-accent" />
        </div>
        <p className="text-[9px] text-muted-foreground mt-1">Settling to 24 drivers…</p>
      </motion.div>

      {/* Floating card 2 — vehicle status */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="absolute -right-4 sm:-right-8 -bottom-6 bg-white rounded-xl shadow-float border border-border/60 p-3.5 w-48 animate-float-slow"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold text-foreground">Vehicle Status</p>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm font-bold text-accent">98</p>
            <p className="text-[8px] text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-500">5</p>
            <p className="text-[8px] text-muted-foreground">Service</p>
          </div>
          <div>
            <p className="text-sm font-bold text-primary">103</p>
            <p className="text-[8px] text-muted-foreground">Total</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}