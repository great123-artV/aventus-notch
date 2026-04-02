import { motion } from "framer-motion";
import { Star } from "lucide-react";
import avatarSarah from "@/assets/avatar-sarah.jpg";
import avatarMarcus from "@/assets/avatar-marcus.jpg";
import avatarElena from "@/assets/avatar-elena.jpg";
import avatarJames from "@/assets/avatar-james.jpg";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    avatar: avatarSarah,
    quote: "Aventus-Notch completely transformed my investment strategy. The AI insights helped me achieve 34% returns in my first year.",
    returns: "+34.2%",
    invested: "$25,000",
    gradientFrom: "from-emerald-500/20",
    gradientTo: "to-teal-500/20",
  },
  {
    name: "Marcus Williams",
    role: "Business Owner",
    avatar: avatarMarcus,
    quote: "The fractional real estate feature is a game-changer. I diversified into property markets I never had access to before.",
    returns: "+28.7%",
    invested: "$120,000",
    gradientFrom: "from-blue-500/20",
    gradientTo: "to-indigo-500/20",
  },
  {
    name: "Elena Rodriguez",
    role: "Physician",
    avatar: avatarElena,
    quote: "I love how everything is in one place — stocks, crypto, retirement planning. The interface is incredibly intuitive.",
    returns: "+41.5%",
    invested: "$85,000",
    gradientFrom: "from-amber-500/20",
    gradientTo: "to-orange-500/20",
  },
  {
    name: "James Okafor",
    role: "Data Analyst",
    avatar: avatarJames,
    quote: "The real-time signals and portfolio analytics gave me the edge I needed. Best investment platform I've ever used.",
    returns: "+22.9%",
    invested: "$15,000",
    gradientFrom: "from-purple-500/20",
    gradientTo: "to-pink-500/20",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Testimonials() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold font-display mb-5 tracking-tight">
            Trusted by <span className="text-gradient">500K+ Investors</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real people, real returns. See how our community is building wealth.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group glass p-6 sm:p-8 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${t.gradientFrom} ${t.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-6">
                  "{t.quote}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-profit">{t.returns}</div>
                    <div className="text-[10px] text-muted-foreground">on {t.invested}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
