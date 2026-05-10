"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

export function CountUp({
  to,
  duration = 1.4,
  decimals = 0,
  className,
}: {
  to: number;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const val = useMotionValue(reduce ? to : 0);
  const rounded = useTransform(val, (latest) =>
    latest.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  useEffect(() => {
    if (inView && !reduce) {
      const controls = animate(val, to, {
        duration,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [inView, to, duration, val, reduce]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
