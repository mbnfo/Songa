import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import HeroDashboard from "./HeroDashboard";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 lg:pt-36 pb-20 lg:pb-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left — copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-border/60 rounded-full pl-1.5 pr-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm mb-6"
          >
            <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> NEW
            </span>
            Automated weekly settlements, now live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-heading font-extrabold tracking-tight text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[1.05]"
          >
            Drive Further with <span className="text-gradient">Smarter Fleet Management</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Songa helps ride-hailing and delivery drivers succeed through intelligent fleet management, weekly earnings processing, fast payouts, and dedicated support—all in one modern platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link to="/register" className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3.5 rounded-full transition-all hover:shadow-float hover:-translate-y-0.5">
              Join Our Fleet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#about" className="inline-flex items-center gap-2 bg-white hover:bg-muted text-foreground font-semibold px-6 py-3.5 rounded-full border border-border transition-all hover:-translate-y-0.5">
              Learn More
            </a>
            <button className="inline-flex items-center gap-2 text-foreground font-semibold px-4 py-3.5 hover:text-primary transition-colors">
              <PlayCircle className="w-5 h-5" />
              Watch Platform Tour
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex items-center gap-5 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> No setup fees</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> GDPR compliant</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> 24/7 support</span>
          </motion.div>
        </div>

        {/* Right — dashboard mockup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative lg:pl-8"
        >
          <HeroDashboard />
        </motion.div>
      </div>
    </section>
  );
}