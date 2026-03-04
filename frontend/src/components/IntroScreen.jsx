import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// TIMING CONSTANTS
// ─────────────────────────────────────────────────────────────
const T = {
  COUNTER_DURATION: 1800,
  NAME_HOLD:        600,
  GLITCH_DURATION:  500,
  CURTAIN_STAGGER:  110,
  PANEL_DURATION:   1200,
};

const PANEL_COUNT = 8;
const NAME = "SKY TAN";
const ROLE = "Developer & Designer";

// ─────────────────────────────────────────────────────────────
// Particle
// FIX: moveY and moveX are pre-computed stable props passed in
// — never call Math.random() inside animate/style during render
// ─────────────────────────────────────────────────────────────
const Particle = ({ delay, x, y, size, duration, moveY, moveX }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: `radial-gradient(circle, #34d399, #10b981)`,
      boxShadow: `0 0 ${size * 2}px #10b981`,
    }}
    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
    animate={{
      opacity: [0, 0.9, 0.6, 0],
      scale: [0, 1.2, 0.8, 0],
      y: [0, moveY],
      x: [0, moveX],
    }}
    transition={{ duration, delay, ease: "easeOut" }}
  />
);

// ─────────────────────────────────────────────────────────────
// GlitchText — RGB split + per-letter entry animation
// ─────────────────────────────────────────────────────────────
const GlitchText = ({ text, isGlitching, className }) => {
  const [glitchOffset, setGlitchOffset] = useState({ r: 0, b: 0 });
  const chars = text.split("");

  useEffect(() => {
    if (!isGlitching) {
      setGlitchOffset({ r: 0, b: 0 });
      return;
    }
    const interval = setInterval(() => {
      setGlitchOffset({
        r: (Math.random() - 0.5) * 12,
        b: (Math.random() - 0.5) * 10,
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isGlitching]);

  return (
    <div className={`relative select-none ${className}`}>
      {/* Red channel */}
      <span
        className="absolute inset-0 text-red-400 mix-blend-screen"
        style={{
          transform: `translate(${glitchOffset.r}px, 0)`,
          opacity: isGlitching ? 0.7 : 0,
          transition: "opacity 0.1s",
          clipPath: "polygon(0 20%, 100% 20%, 100% 45%, 0 45%)",
        }}
        aria-hidden
      >
        {text}
      </span>
      {/* Cyan channel */}
      <span
        className="absolute inset-0 text-cyan-400 mix-blend-screen"
        style={{
          transform: `translate(${-glitchOffset.b}px, 0)`,
          opacity: isGlitching ? 0.7 : 0,
          transition: "opacity 0.1s",
          clipPath: "polygon(0 55%, 100% 55%, 100% 80%, 0 80%)",
        }}
        aria-hidden
      >
        {text}
      </span>
      {/* Main letters — stagger in one by one */}
      <span className="relative z-10 inline-flex">
        {chars.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.45,
              delay: index * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CounterDisplay
// ─────────────────────────────────────────────────────────────
const CounterDisplay = ({ progress }) => {
  const display = Math.round(progress);
  return (
    <div
      className="font-mono text-8xl md:text-[10rem] font-black text-white tabular-nums leading-none tracking-tighter"
      style={{
        textShadow: `0 0 40px rgba(16,185,129,0.3), 0 0 80px rgba(16,185,129,0.1)`,
      }}
    >
      {String(display).padStart(2, "0")}
      <span className="text-emerald-400 text-6xl md:text-8xl">%</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// IntroScreen
// ─────────────────────────────────────────────────────────────
const IntroScreen = ({ onComplete, name = NAME }) => {
  // Phases:
  // "loading"  → counter 0→100 + progress bar
  // "explode"  → name blasts in, particles burst
  // "glitch"   → RGB split on name
  // "curtain"  → panels lift out
  // "done"     → unmount
  const [phase, setPhase] = useState("loading");
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isGlitching, setIsGlitching] = useState(false);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  // Mouse parallax on name
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handler = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 15);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  // ── Loading counter animation ──────────────────────────────
  useEffect(() => {
    if (phase !== "loading") return;
    startTimeRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / T.COUNTER_DURATION, 1);
      // Cubic ease-in-out: fast start, decelerates near 100%
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(eased * 100);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => setPhase("explode"), 200);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase]);

  // ── Explode phase setup ───────────────────────────────────
  useEffect(() => {
    if (phase !== "explode") return;

    const newParticles = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 40,
      y: 35 + Math.random() * 30,
      size: 3 + Math.random() * 7,
      delay: Math.random() * 0.4,
      duration: 0.8 + Math.random() * 0.8,
      moveY: -60 - Math.random() * 100,
      moveX: (Math.random() - 0.5) * 80,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setIsGlitching(true);
      setPhase("glitch");
    }, T.NAME_HOLD);

    return () => clearTimeout(timer);
  }, [phase]);

  // ── Glitch phase timing ───────────────────────────────────
  useEffect(() => {
    if (phase !== "glitch") return;

    const timer = setTimeout(() => {
      setIsGlitching(false);
      setPhase("curtain");
    }, T.GLITCH_DURATION);

    return () => clearTimeout(timer);
  }, [phase]);

  // ── Curtain exit timing ───────────────────────────────────
  useEffect(() => {
    if (phase !== "curtain") return;

    const totalCurtain = (PANEL_COUNT - 1) * T.CURTAIN_STAGGER + T.PANEL_DURATION + 220;
    const timer = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, totalCurtain);

    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  const isCurtain = phase === "curtain";
  const showName = phase === "explode" || phase === "glitch";

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999, pointerEvents: "all" }}
    >
      {isCurtain &&
        Array.from({ length: PANEL_COUNT }).map((_, i) => {
          const panelW = 100 / PANEL_COUNT;
          return (
            <motion.div
              key={i}
              className="absolute top-0 bottom-0"
              style={{
                left: `${i * panelW}%`,
                width: `${panelW + 0.4}%`,
                background: i % 2 === 0 ? "#080808" : "#0c0c0c",
                zIndex: 30,
              }}
              initial={{ y: 0, filter: "blur(0px)" }}
              animate={{ y: "-102%", filter: ["blur(0px)", "blur(5px)", "blur(0px)"] }}
              transition={{
                duration: T.PANEL_DURATION / 1000,
                delay: i * (T.CURTAIN_STAGGER / 1000),
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{
                  background: "linear-gradient(90deg, transparent, #10b981, #34d399, transparent)",
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
                transition={{
                  duration: T.PANEL_DURATION / 1000,
                  delay: i * (T.CURTAIN_STAGGER / 1000),
                }}
              />
            </motion.div>
          );
        })}

      {/* ══════════════════════════════════════════════
          MAIN CONTENT LAYER
          FIX: z-[20] — above black bg fill (z-1),
          but panels at z-30 sit on top and lift away
      ══════════════════════════════════════════════ */}

      {/* Solid black background fill */}
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ zIndex: 1 }}
        animate={{ opacity: isCurtain ? 0 : 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Emerald ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          zIndex: 2,
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
        }}
        animate={
          isCurtain
            ? { scale: 1.05, opacity: 0 }
            : showName
            ? { scale: [1, 1.5, 1.2], opacity: [0.4, 1, 0.7] }
            : { scale: 1, opacity: 0.4 }
        }
        transition={{ duration: isCurtain ? 0.8 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Subtle emerald grid */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          backgroundImage: `
            linear-gradient(rgba(16,185,129,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        animate={{ opacity: isCurtain ? 0 : 0.03 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* CRT scanlines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 25,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 3px)",
        }}
        animate={{ opacity: isCurtain ? 0 : 0.025 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Vignette */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)",
        }}
        animate={{ opacity: isCurtain ? 0 : 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── LOADING PHASE ── */}
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center gap-8"
            style={{ zIndex: 20 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -24, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Counter */}
            <CounterDisplay progress={progress} />

            {/* Progress bar */}
            <div className="w-64 md:w-96 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #10b981, #34d399, #10b981)",
                  backgroundSize: "200% 100%",
                  boxShadow: "0 0 12px rgba(16,185,129,0.8)",
                }}
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              {/* Glowing dot at leading edge */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"
                style={{
                  left: `calc(${progress}% - 4px)`,
                  boxShadow: "0 0 6px #34d399, 0 0 14px #10b981",
                  transition: "left 0.05s linear",
                }}
              />
            </div>

            {/* Initialising label */}
            <motion.p
              className="text-xs font-bold uppercase tracking-[0.45em] text-emerald-500/70 font-mono"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              Initialising
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NAME / GLITCH / CURTAIN PHASE ── */}
      {/* FIX: AnimatePresence mode="wait" so name mounts cleanly */}
      <AnimatePresence mode="wait">
        {showName && (
          <motion.div
            key="name-block"
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ zIndex: 20, x: smX, y: smY }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06, y: -20, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          >
            {/* Particle burst layer */}
            <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 21 }}>
              {particles.map((p) => (
                <Particle key={p.id} {...p} />
              ))}
            </div>

            <div className="flex flex-col items-center gap-5 relative" style={{ zIndex: 22 }}>

              {/* Name with per-letter animation */}
              {/* FIX: paddingBottom prevents overflow:hidden clipping the descenders */}
              <div className="overflow-hidden" style={{ paddingBottom: "0.1em" }}>
                <motion.div
                  initial={{ y: "110%", skewX: -10 }}
                  animate={{ y: 0, skewX: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <GlitchText
                    text={name}
                    isGlitching={isGlitching}
                    className="font-display text-6xl sm:text-8xl md:text-[9rem] font-black tracking-tighter text-white leading-none"
                  />
                </motion.div>
              </div>

              {/* Role — slides up after name */}
              <div className="overflow-hidden w-full flex justify-center">
                <motion.div
                  initial={{ y: "120%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    className="h-[1px] bg-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: 32 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.38em] text-emerald-400 font-mono">
                    {ROLE}
                  </span>
                  <motion.div
                    className="h-[1px] bg-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: 32 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                  />
                </motion.div>
              </div>

              {/* Emerald underline draws left → right */}
              <motion.div
                className="h-[2px] rounded-full self-stretch"
                style={{
                  background: "linear-gradient(90deg, #10b981, #34d399, #06b6d4, #10b981)",
                  boxShadow: "0 0 10px rgba(16,185,129,0.6)",
                }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Corner brackets */}
              {[
                { pos: "top-0 left-0", border: "border-t-2 border-l-2" },
                { pos: "top-0 right-0", border: "border-t-2 border-r-2" },
                { pos: "bottom-0 left-0", border: "border-b-2 border-l-2" },
                { pos: "bottom-0 right-0", border: "border-b-2 border-r-2" },
              ].map(({ pos, border }, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-6 h-6 border-emerald-400/70 ${pos} ${border}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.3, ease: "backOut" }}
                />
              ))}

              {/* Pulse ring behind name */}
              <motion.div
                className="absolute rounded-full border border-emerald-500/20 pointer-events-none"
                initial={{ width: 200, height: 80, opacity: 0 }}
                animate={{
                  width: [200, 600],
                  height: [80, 240],
                  opacity: [0.6, 0],
                }}
                transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroScreen;