import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Trophy, Users, Star } from 'lucide-react';

const sponsors = [
  { name: "Arsenal FC", role: "Official Global Partner", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png" },
  { name: "Everton FC", role: "Principal Partner", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Everton_FC_logo.svg/1200px-Everton_FC_logo.svg.png" },
  { name: "Aston Villa", role: "Sleeve Sponsor", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Aston_Villa_FC_crest_%282016%29.svg/1200px-Aston_Villa_FC_crest_%282016%29.svg.png" },
  { name: "AS Roma", role: "Official Trading Partner", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/AS_Roma_logo_%282017%29.svg/1200px-AS_Roma_logo_%282017%29.svg.png" }
];

export const Sponsorships = () => {
  return (
    <section className="py-24 bg-white/[0.01] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Trophy className="w-3 h-3" />
            Global Partnerships
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Trusted by World-Class Organizations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aventus-Notch is proud to be the official investment partner of some of the most prestigious sports teams and cultural institutions globally.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sponsors.map((sponsor, idx) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center group"
            >
              <div className="w-20 h-20 mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="font-bold text-lg mb-1">{sponsor.name}</h4>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{sponsor.role}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-12 text-muted-foreground/60 font-bold uppercase tracking-widest text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            SEC Regulated
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            4.8/5 App Store Rating
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Global Community
          </div>
        </div>
      </div>
    </section>
  );
};
