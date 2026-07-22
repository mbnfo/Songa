import Reveal from "./Reveal";
import { Wallet, Users, CheckCircle, TrendingUp, Search, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

const chartData = [
  { day: "Mon", earnings: 4200 },
  { day: "Tue", earnings: 5100 },
  { day: "Wed", earnings: 4800 },
  { day: "Thu", earnings: 6200 },
  { day: "Fri", earnings: 7400 },
  { day: "Sat", earnings: 8900 },
  { day: "Sun", earnings: 6800 },
];

const payoutData = [
  { week: "W24", amount: 38 }, { week: "W25", amount: 41 },
  { week: "W26", amount: 45 }, { week: "W27", amount: 43 },
  { week: "W28", amount: 49 }, { week: "W29", amount: 48 },
];

const drivers = [
  { name: "James Wilson", trips: 42, payout: "£1,387", status: "paid" },
  { name: "Sarah Chen", trips: 38, payout: "£1,264", status: "pending" },
  { name: "Michael Okafor", trips: 45, payout: "£1,426", status: "paid" },
  { name: "Emma Davies", trips: 30, payout: "£1,005", status: "pending" },
];

export default function DashboardPreview() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Interactive Preview</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              Your entire fleet, in one dashboard
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Real charts, live tables and instant insight — the same experience your team gets after login.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-border/60 shadow-float overflow-hidden bg-white">
            {/* Top bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/60 bg-muted/40">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="ml-2 flex items-center gap-2 flex-1 max-w-md bg-white rounded-lg border border-border px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Search drivers, payouts, weeks…</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" /> Live
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-5 p-5 lg:p-6">
              {/* Stat cards */}
              {[
                { icon: Wallet, label: "Weekly Earnings", value: "£48,920", trend: "+12.4%", color: "bg-primary/10 text-primary" },
                { icon: Users, label: "Active Drivers", value: "127", trend: "+8 this week", color: "bg-accent/10 text-accent" },
                { icon: CheckCircle, label: "Settlement Rate", value: "96%", trend: "On time", color: "bg-violet-100 text-violet-600" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-border/60 p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">{s.value}</p>
                  <p className="text-xs text-accent font-medium mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {s.trend}</p>
                </div>
              ))}

              {/* Area chart */}
              <div className="lg:col-span-2 rounded-2xl border border-border/60 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Weekly Earnings Overview</p>
                    <p className="text-xs text-muted-foreground">Last 7 days · all drivers</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><span className="w-2 h-2 rounded-full bg-primary" /> Earnings</span>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0D47A1" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#0D47A1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                      <Area type="monotone" dataKey="earnings" stroke="#0D47A1" strokeWidth={2.5} fill="url(#earnGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar chart */}
              <div className="rounded-2xl border border-border/60 p-5">
                <p className="text-sm font-semibold text-foreground mb-1">Payouts by Week</p>
                <p className="text-xs text-muted-foreground mb-3">in thousands (PLN)</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={payoutData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                      <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#1565C0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Drivers table */}
              <div className="lg:col-span-3 rounded-2xl border border-border/60 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 bg-muted/40">
                  <p className="text-sm font-semibold text-foreground">Recent Driver Payouts</p>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-white border border-border px-2.5 py-1.5 rounded-lg">
                    <Filter className="w-3.5 h-3.5" /> Filter
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs text-muted-foreground bg-muted/20">
                      <tr>
                        <th className="px-5 py-2.5 font-medium">Driver</th>
                        <th className="px-5 py-2.5 font-medium">Trips</th>
                        <th className="px-5 py-2.5 font-medium">Net Payout</th>
                        <th className="px-5 py-2.5 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {drivers.map((d, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold flex items-center justify-center">
                                {d.name.charAt(0)}
                              </div>
                              <span className="font-medium text-foreground">{d.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{d.trips}</td>
                          <td className="px-5 py-3.5 font-semibold text-foreground">{d.payout}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${d.status === "paid" ? "bg-accent/10 text-accent" : "bg-amber-100 text-amber-700"}`}>
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}