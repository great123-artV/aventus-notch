import { Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockRealEstate } from "@/lib/mock-data";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";

const filters = ["All", "Residential", "Commercial", "Hospitality"];

const RealEstate = () => {
  const [filter, setFilter] = useState("All");
  const properties = filter === "All" ? mockRealEstate : mockRealEstate.filter((p) => p.type === filter);

  return (
    <AnimatedPage>
      <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Real Estate</h1>
          <p className="text-muted-foreground mt-1">Fractional ownership in premium properties</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((prop, i) => (
            <motion.div
              key={prop.id}
              className="glass rounded-xl overflow-hidden group hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={prop.image} alt={prop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-profit/90 text-foreground">
                  {prop.roi}% ROI
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold font-display text-lg mb-1">{prop.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {prop.location}
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Invest from</span>
                  <span className="font-semibold text-profit">${prop.minInvestment.toLocaleString()}</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Funded</span>
                    <span>{prop.funded}%</span>
                  </div>
                  <Progress value={prop.funded} className="h-1.5 bg-secondary" />
                </div>
                <Button className="w-full gradient-primary border-0 text-foreground shadow-glow" size="sm">
                  <Building2 className="w-4 h-4 mr-1" /> Invest Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default RealEstate;
