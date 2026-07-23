import { Link } from "react-router-dom";
import { Truck, LinkedinIcon, FacebookIcon, InstagramIcon, Mail, MapPin, Phone, Send, TwitterIcon } from "lucide-react";

const columns = [
  { title: "Company", links: ["About", "Careers", "Contact"] },
  { title: "Drivers", links: ["Register", "Driver Portal", "Support"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
];

const socialLinks = [
                                    { Icon: TwitterIcon, url: "https://twitter.com/yourhandle" },
                                    { Icon: LinkedinIcon, url: "https://linkedin.com/company/yourcompany" },
                                    { Icon: FacebookIcon, url: "https://facebook.com/yourpage" },
                                    { Icon: InstagramIcon, url: "https://instagram.com/yourhandle" },
                                  ];

export default function Footer() {
  return (
    <footer className="bg-foreground text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top — newsletter + intro */}
        <div className="grid lg:grid-cols-2 gap-10 pb-12 border-b border-white/10">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="font-heading font-extrabold text-lg text-white">Songa</span>
                <span className="block text-[10px] font-medium text-white/50 -mt-0.5 tracking-wider uppercase">Fleet Management</span>
              </div>
            </Link>
            <p className="text-sm max-w-sm leading-relaxed">
              The intelligent platform for ride-hailing and delivery drivers — automating earnings, settlements and fleet operations at scale.
            </p>
            <div className="flex gap-3 mt-5">
              

                                  {socialLinks.map(({ Icon, url }, i) => (
                                    <a
                                      key={i}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
                                    >
                                      <Icon className="w-4 h-4 text-white" />
                                    </a>
                                  ))}

              {/* 
              /*[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))

               */}

            </div>
          </div>
          <div className="lg:justify-self-end">
            <h4 className="font-heading font-semibold text-white mb-3">Stay in the loop</h4>
            <p className="text-sm mb-4 max-w-sm">Get product updates and driver insights. No spam, ever.</p>
            <form className="flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary" />
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 text-sm font-semibold">
                Subscribe <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle — link columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-12 border-b border-white/10">
          {columns.map(col => (
            <div key={col.title}>
              <h5 className="font-heading font-semibold text-white text-sm mb-4">{col.title}</h5>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    {l === "Register" ? (
                      <Link to="/register" className="text-sm hover:text-white transition-colors">{l}</Link>
                    ) : l === "Driver Portal" ? (
                      <Link to="/login" className="text-sm hover:text-white transition-colors">{l}</Link>
                    ) : (
                      <a href="#contact" className="text-sm hover:text-white transition-colors">{l}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom — contact + copyright */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" /> hello@songafleet.com</span>
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-primary" /> +48 22 100 20 30</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> Warsaw, Poland</span>
          </div>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Songa Fleet Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}