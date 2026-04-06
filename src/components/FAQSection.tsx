import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is my money safe with Aventus-Notch?",
    a: "Absolutely. We use bank-level 256-bit AES encryption and all accounts are SIPC insured up to $500,000. Your funds are held in segregated accounts at regulated custodial banks.",
  },
  {
    q: "Are there any hidden fees?",
    a: "No. Stock and ETF trading is commission-free. Our Pro and Elite plans have transparent monthly pricing with no hidden charges. Crypto trades have a small spread, clearly shown before you confirm.",
  },
  {
    q: "How does fractional real estate work?",
    a: "You can invest in premium commercial and residential properties starting from $50,000. You own a proportional share and earn rental income and appreciation. Properties are vetted by our real estate team with projected 8–15% annual returns.",
  },
  {
    q: "What is the AI Portfolio Insights feature?",
    a: "Our AI analyzes your holdings, risk tolerance, and market conditions to suggest optimal portfolio allocations. It provides real-time rebalancing signals and alerts for opportunities across all asset classes.",
  },
  {
    q: "Can I withdraw my funds at any time?",
    a: "Yes. Stocks, crypto, and forex positions can be liquidated and withdrawn within 1–3 business days. Real estate investments have a minimum 12-month lock-in period, after which you can sell your shares on our secondary marketplace.",
  },
  {
    q: "Which countries do you support?",
    a: "Aventus-Notch is available in 120+ countries. Supported features may vary by region due to local regulations. Check our website for full availability details.",
  },
  {
    q: "How do retirement plans work?",
    a: "We offer AI-optimized retirement accounts (IRA, Roth IRA, 401k rollover) with tax-advantaged growth. Our algorithms automatically adjust your allocation as you approach retirement age, maximizing compound returns.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold font-display mb-5 tracking-tight">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know before you start investing.
          </p>
        </motion.div>

        <motion.div
          className="glass p-6 sm:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/50">
                <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}