import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin horizontal progress bar fixed at the top of the viewport.
 * Tracks page scroll from 0 → 100%.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}
