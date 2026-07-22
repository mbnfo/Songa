import Reveal from "./Reveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Songa has made managing my weekly earnings effortless. Payments are always transparent and on time.",
    name: "Marek Kowalski",
    role: "Professional Driver",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
  },
  {
    quote: "The support team has been fantastic from day one. I always know exactly what I've earned.",
    name: "Anna Nowak",
    role: "Fleet Driver",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
  },
  {
    quote: "Joining Songa was one of the best decisions I made for my driving business.",
    name: "Tomasz Wiśniewski",
    role: "Delivery Driver",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-foreground mt-2 tracking-tight">
              Drivers love working with Songa
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Hear from the professional drivers who trust us with their earnings.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="h-full bg-white rounded-3xl border border-border/60 p-7 hover:shadow-float transition-all duration-300 flex flex-col">
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-border/60">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}