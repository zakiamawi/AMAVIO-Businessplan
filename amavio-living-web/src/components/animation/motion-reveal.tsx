"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealElement = "article" | "div" | "section";

type MotionRevealProps = {
  as?: RevealElement;
  children: ReactNode;
  className?: string;
  delay?: number;
  eager?: boolean;
  id?: string;
  ariaLabel?: string;
};

const motionElements = {
  article: motion.article,
  div: motion.div,
  section: motion.section,
};

export function MotionReveal({
  as = "div",
  children,
  className,
  delay = 0,
  eager = false,
  id,
  ariaLabel,
}: MotionRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motionElements[as];

  return (
    <Component
      aria-label={ariaLabel}
      className={className}
      id={id}
      animate={eager && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
      initial={prefersReducedMotion || eager ? false : { opacity: 0, y: 24 }}
      transition={{ delay, duration: 0.55, ease: "easeOut" }}
      viewport={{ amount: 0.18, once: true }}
      whileInView={prefersReducedMotion || eager ? undefined : { opacity: 1, y: 0 }}
    >
      {children}
    </Component>
  );
}
