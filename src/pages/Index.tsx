import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, Globe, Building2, PiggyBank, Shield, Users, ArrowRight,
  Lock, Zap, ChevronRight, LineChart
} from "lucide-react";

const categories = [
  { icon: TrendingUp, title: "Stocks & Shares", desc: "Invest in top-performing companies worldwide with real-time market data.", color: "from-blue-500/20 to-blue-600/5" },
  { icon: LineChart, title: "Cryptocurrency", desc: "Trade Bitcoin, Ethereum, and 200+ digital assets with live pricing.", color: "from-purple-500/20 to-purple-600/5" },
  { icon: Globe, title: "Forex Trading", desc: "Access global currency markets with competitive spreads and leverage.", color: "from-yellow-500/20 to-yellow-600/5" },
  { icon: Building2, title: "Real Estate", desc: "Own fractions of premium properties starting from $50,000.", color: "from-emerald-500/20 to-emerald-600/5" },
  { icon: PiggyBank, title: "Retirement Plans", desc: "Plan your future with smart retirement calculators and projections.", color: "from-pink-500/20 to-pink-600/5" },
];

const stats = [
  { value: "$12.4B+", label: "Assets Under Management" },
  { value: "500K+", label: "Active Investors" },
  { value: "120+", label: "Countries Served" },
  { value: "99.99%", label: "Uptime Guaranteed" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span>Now with AI-Powered Portfolio Insights</span>
            <ChevronRight className="w-4 h-4" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display leading-tight mb-6">
            Invest Smarter.
            <br />
            <span className="text-gradient">Grow Without Limits.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            One platform for stocks, crypto, forex, real estate, and retirement.
            Build wealth with institutional-grade tools designed for everyone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary border-0 text-foreground shadow-glow text-base px-8 py-6 rounded-xl">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link to="/markets">
              <Button variant="outline" size="lg" className="bg-secondary/30 border-glass-border text-foreground text-base px-8 py-6 rounded-xl hover:bg-secondary/50">
                Explore Markets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-5 h-5 text-profit" />
            <span>SEC Regulated</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lock className="w-5 h-5 text-profit" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-5 h-5 text-profit" />
            <span>500K+ Investors</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-5 h-5 text-profit" />
            <span>Global Access</span>
          </div>
        </div>
      </section>

      {/* Investment Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Every Asset Class. <span className="text-gradient">One Platform.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Diversify across the world's most profitable markets from a single dashboard.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div key={cat.title} className="group glass p-6 rounded-xl hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold font-display mb-2">{cat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto glass-strong rounded-2xl p-10 sm:p-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold font-display text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">
            Ready to Build Your <span className="text-gradient">Wealth?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join 500,000+ investors already growing their portfolios with Aventus-Notch.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gradient-primary border-0 text-foreground shadow-glow text-base px-10 py-6 rounded-xl">
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-foreground" />
                </div>
                <span className="font-bold font-display">Aventus-Notch</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The all-in-one investment ecosystem for modern investors.
              </p>
            </div>
            {[
              { title: "Products", links: ["Stocks", "Crypto", "Forex", "Real Estate", "Retirement"] },
              { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{link}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © 2026 Aventus-Notch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
