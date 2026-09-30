"use client";

import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./frequently-asked-questions-with-accordion-utils/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FrequentlyAskedQuestionsProps {
  title?: string;
  description?: string;
  data?: FAQItem[];
  className?: string;
  supportEmail?: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "What does TrimToken AI route?",
    answer:
      "TrimToken AI classifies each request by complexity, then selects the most cost-effective model tier that meets the configured quality requirements. The live routing stream shows the model, latency, token usage, realized cost, and savings for every decision.",
  },
  {
    question: "Can I use the app without provider API keys?",
    answer:
      "Yes. This demo runs in local-only mode with deterministic routing and synthesis fallbacks. It does not connect to third-party model providers or read provider API keys from the repository.",
  },
  {
    question: "How are cost savings calculated?",
    answer:
      "Each routing decision compares the selected model's realized cost with the configured frontier baseline cost for the same request. The dashboard aggregates those values into total cost, naive cost, savings, and retained percentage.",
  },
  {
    question: "What is the difference between benchmark and user traffic?",
    answer:
      "Benchmark traffic comes from the built-in simulation samples, while user traffic comes from questions entered through the playground. Both appear in the routing stream and contribute to the live analytics totals.",
  },
  {
    question: "Where can I inspect routing details?",
    answer:
      "Use the Playground stream for live decisions, Routing Log for searchable history, Analytics for aggregate trends, and Gateway Docs for the OpenAI-compatible local API endpoints.",
  },
  {
    question: "How do I get help with the demo?",
    answer:
      "Use the Gateway Docs tab for integration details or contact the TrimToken team through the support address below. For production deployments, review your hosting and provider secret stores separately from this local demo.",
  },
];

export default function FrequentlyAskedQuestions({
  title = "Frequently asked questions",
  description = "Learn how TrimToken AI routes requests, calculates savings, and keeps this demo provider-free.",
  data = defaultFAQs,
  className,
  supportEmail = "support@trimtoken.ai",
}: FrequentlyAskedQuestionsProps) {
  const words = title.split(" ");

  return (
    <section className={cn("relative w-full overflow-hidden py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="relative z-10 mx-auto max-w-4xl text-center font-display text-3xl font-bold tracking-tight text-[#dfe2eb] md:text-5xl">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-base text-[#b9ccb2] md:text-lg"
        >
          {description}{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-[#00e5ff] underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            {supportEmail}
          </a>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 rounded-2xl border border-[#3b4b37]/60 bg-[#10141a]/70 px-5 sm:px-8"
        >
          <Accordion type="single" collapsible className="w-full">
            {data.map((item, index) => (
              <motion.div
                key={`faq-${index}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: 0.5 + index * 0.07,
                  ease: "easeOut",
                }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
