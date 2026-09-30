import React from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function SkiperReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={reduceMotion ? undefined : { duration: 0.72, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function SkiperLift({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
      whileTap={reduceMotion ? undefined : { scale: 0.995 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {children}
    </motion.div>
  );
}
