import React, { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import useDarkMode from "../hooks/useDarkMode";
import DayNightToggle from "../components/DayNightToggle";
import ScrollProgress from "../components/ScrollProgress";
import ConstellationBg from "../components/ConstellationBg";
import MatrixRain from "../components/MatrixRain";
import { heroContent, expertise, projects } from "../data/portfolio";

// ─────────────────────────────────────────────
// Utility: wrap value between min and max
// ─────────────────────────────────────────────
function wrap(min, max, v) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

// ─────────────────────────────────────────────
// Animated Name: each letter lifts on hover
// ─────────────────────────────────────────────
const AnimatedName = ({ text }) => (
  <span className="inline-flex">
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        className="inline-block"
        whileHover={{
          y: -8,
          rotate: -5,
          color: "#888",
          transition: { type: "spring", stiffness: 500, damping: 10 },
        }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

// ─────────────────────────────────────────────
// Gradient Section Divider
// ─────────────────────────────────────────────
const Divider = () => <div className="section-divider w-full" />;

// ─────────────────────────────────────────────
// Reveal wrapper — snaps in from below on scroll
// ─────────────────────────────────────────────
const ScrollReveal = ({ children, delay = 0, direction = "up", className = "" }) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1], // expo-out — snappy and satisfying
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-10% 0px -10% 0px", amount: 0.55 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Parallax Layer — maps scroll position to translateY
// ─────────────────────────────────────────────
const ParallaxLayer = ({ children, speed = 0.3, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}px`, `${speed * 100}px`]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Horizontal Marquee — velocity-linked ticker
// ─────────────────────────────────────────────
const skills = ["React", "Python", "TypeScript", "Data Viz", "Machine Learning", "UI/UX", "Node.js", "SQL"];
const repeatedSkills = [...skills, ...skills, ...skills, ...skills];

const VelocityMarquee = ({ baseVelocity = 3 }) => {
  const containerRef = useRef(null);
  const isActiveRef = useRef(true);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-3000, 3000], [-5, 5]);

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef(1);

  useEffect(() => {
    const marqueeEl = containerRef.current;
    if (!marqueeEl) return;

    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = entry.isIntersecting && !document.hidden;
      },
      { threshold: 0.01 }
    );

    observer.observe(marqueeEl);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (!isActiveRef.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={containerRef} className="overflow-hidden py-3 border-y border-black/8 dark:border-white/8 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
      <motion.div style={{ x }} className="flex whitespace-nowrap gap-0">
        {repeatedSkills.map((skill, i) => (
          <span
            key={i}
            className="inline-block px-6 text-sm font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500"
          >
            {skill}
            <span className="ml-6 text-gray-200 dark:text-gray-700">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────
// NeonSequence (typewriter / glitch)
// ─────────────────────────────────────────────
const NeonSequence = () => {
  const [animationState, setAnimationState] = React.useState("initial");
  const fullSubtitle = heroContent?.tagline ?? "";
  const welcomingText = (heroContent?.welcoming ?? "").trim();
  const [typedSubtitle, setTypedSubtitle] = React.useState("");

  React.useEffect(() => {
    let timers = [];
    const startSequence = () => {
      setAnimationState("phase1");
      timers.push(setTimeout(() => setAnimationState("phase2"), 2000));
      timers.push(setTimeout(() => setAnimationState("pulse"), 4000));
      timers.push(setTimeout(() => setAnimationState("glitch"), 8000));
      timers.push(setTimeout(() => setAnimationState("dark"), 9000));
      timers.push(setTimeout(() => startSequence(), 10500));
    };
    const t = setTimeout(startSequence, 100);
    timers.push(t);
    return () => timers.forEach(clearTimeout);
  }, []);

  React.useEffect(() => {
    if (animationState !== "phase2") {
      setTypedSubtitle(animationState === "pulse" ? fullSubtitle : "");
      return;
    }
    let index = 0;
    setTypedSubtitle("");
    const typeTimer = setInterval(() => {
      index += 1;
      setTypedSubtitle(fullSubtitle.slice(0, index));
      if (index >= fullSubtitle.length) clearInterval(typeTimer);
    }, 50);
    return () => clearInterval(typeTimer);
  }, [animationState, fullSubtitle]);

  return (
    <div className="relative z-10 mb-8 w-full group">
      <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-white/10 dark:to-white/5 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
      <motion.div
        className="relative bg-white/50 dark:bg-black/10 ring-1 ring-black/5 dark:ring-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden backdrop-blur-sm"
        animate={animationState === "pulse" ? { scale: [1, 1.005, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black/5 dark:bg-white/5 rounded-full blur-[80px] transition-opacity duration-1000 ${animationState === "pulse" ? "opacity-30" : "opacity-0"}`} />
        <div className="flex flex-col justify-center min-h-[140px] z-20 relative text-center sm:text-left">
          <h1 className={`font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-3 transition-all duration-300 text-black dark:text-white ${animationState === "glitch" ? "blur-[1px] translate-x-1" : ""}`}>
            {welcomingText || "Welcome to my portfolio!"}
          </h1>
          <h2 className="font-sans text-xl sm:text-2xl text-accent-gray tracking-wide h-8 font-medium">
            {animationState === "phase2" || animationState === "pulse" ? (
              <span className="border-r-2 border-black dark:border-white pr-1 animate-pulse">
                {typedSubtitle}
              </span>
            ) : (
              <span className="opacity-0">{fullSubtitle}</span>
            )}
          </h2>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Expertise Card with scroll-stagger
// ─────────────────────────────────────────────
const ExpertiseCard = ({ item, index }) => (
  <ScrollReveal delay={index * 0.08} direction="up">
    <motion.div
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 18 } }}
      className="p-8 rounded-3xl bg-white dark:bg-background-dark border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-colors duration-300 group backdrop-blur-sm h-full"
    >
      <item.icon className="w-10 h-10 mb-6 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
      <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{item.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{item.desc}</p>
      <div className="flex items-baseline gap-1">
        <motion.span
          className="text-3xl font-black text-black dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3 + index * 0.08 }}
        >
          {item.stat}
        </motion.span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{item.statLabel}</span>
      </div>
    </motion.div>
  </ScrollReveal>
);

// ─────────────────────────────────────────────
// Project Card with scroll-stagger + depth tilt
// ─────────────────────────────────────────────
const ProjectCard = ({ project, index }) => {
  const outerRef = useRef(null);
  const boundsRef = useRef(null);
  const frameRef = useRef(0);
  const latestPointerRef = useRef({ x: 0, y: 0 });
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const measureBounds = () => {
    const el = outerRef.current;
    if (!el) return;
    boundsRef.current = el.getBoundingClientRect();
  };

  const applyTilt = () => {
    frameRef.current = 0;
    const rect = boundsRef.current;
    if (!rect) return;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((latestPointerRef.current.y - cy) / rect.height) * -10);
    rotateY.set(((latestPointerRef.current.x - cx) / rect.width) * 10);
  };

  const handleMouse = (e) => {
    latestPointerRef.current = { x: e.clientX, y: e.clientY };
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(applyTilt);
    }
  };

  const handleLeave = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    rotateX.set(0);
    rotateY.set(0);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <ScrollReveal delay={index * 0.12} direction="up">
      <div
        ref={outerRef}
        onMouseEnter={measureBounds}
        onFocus={measureBounds}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        className="h-full"
      >
        <motion.div
          style={{ rotateX: springX, rotateY: springY, transformPerspective: 1000 }}
          whileHover={{ y: -12 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="group relative cursor-pointer h-full"
        >
          <div className="aspect-[4/3] bg-gray-100 dark:bg-surface-dark rounded-2xl overflow-hidden mb-6 border border-black/5 dark:border-white/10">
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-black group-hover:scale-108 transition-transform duration-700 flex items-center justify-center relative overflow-hidden">
              {/* Shimmer overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{ skewX: "-20deg" }}
              />
              <project.icon className="w-12 h-12 text-gray-300 dark:text-gray-600" strokeWidth={1} />
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-1 text-black dark:text-white group-hover:underline decoration-2 underline-offset-4">
                {project.title}
              </h3>
              <p className="text-accent-gray text-sm mb-3">{project.category}</p>
              <p className="text-sm text-gray-500 max-w-xs">{project.description}</p>
            </div>
            <motion.button
              whileHover={{ rotate: 45, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors flex-shrink-0"
            >
              <span className="material-icons-round text-sm">arrow_outward</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </ScrollReveal>
  );
};

// ─────────────────────────────────────────────
// Floating section label (sticks to left edge)
// ─────────────────────────────────────────────
const SectionLabel = ({ label }) => (
  <ScrollReveal direction="left">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px bg-black dark:bg-white" />
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">{label}</span>
    </div>
  </ScrollReveal>
);

const journeyData = [
  {
    year: "2021",
    phase: "The Spark",
    title: "Discovered My Passion",
    description:
      "Started exploring programming through online courses. Fell in love with the intersection of data and design — building my first visualizations that turned raw numbers into stories.",
    tags: ["Python", "HTML/CSS", "Data Viz"],
  },
  {
    year: "2022–23",
    phase: "The Build",
    title: "Levelled Up Fast",
    description:
      "Dived deep into full-stack development and machine learning. Built real projects, shipped real code, and learned that the best way to grow is to build something people actually use.",
    tags: ["React", "Node.js", "ML", "SQL"],
  },
  {
    year: "2024→",
    phase: "The Now",
    title: "Building With Purpose",
    description:
      "Focused on crafting insight-driven products. Every line of code serves a purpose: making complex data simple, interfaces intuitive, and impact measurable.",
    tags: ["TypeScript", "UI/UX", "AI", "Leadership"],
  },
];

const JourneyCardInner = ({ item }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="relative bg-white dark:bg-surface-dark border border-black/5 dark:border-white/10 hover:border-emerald-400/40 rounded-2xl p-6 shadow-sm hover:shadow-emerald-500/10 hover:shadow-lg transition-all duration-300 group"
  >
    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">{item.year}</span>
      <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.phase}</span>
    </div>

    <h3 className="text-xl font-black text-black dark:text-white mb-2 tracking-tight">{item.title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{item.description}</p>

    <div className="flex flex-wrap gap-2">
      {item.tags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
        >
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

const JourneyCard = ({ item, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "center 0.45"],
  });

  const isLeft = index % 2 === 0;
  const cardXRaw = useTransform(scrollYProgress, [0.18, 0.9], [isLeft ? -56 : 56, 0]);
  const cardOpacityRaw = useTransform(scrollYProgress, [0.12, 0.7], [0, 1]);
  const lineProgressRaw = useTransform(scrollYProgress, [0.02, 0.98], [0, 1]);
  const mobileCardXRaw = useTransform(scrollYProgress, [0.2, 0.9], [40, 0]);

  const cardX = useSpring(cardXRaw, { stiffness: 120, damping: 24, mass: 0.45 });
  const cardOpacity = useSpring(cardOpacityRaw, { stiffness: 140, damping: 26, mass: 0.4 });
  const lineProgress = useSpring(lineProgressRaw, { stiffness: 132, damping: 26, mass: 0.44 });
  const lineHeight = useTransform(lineProgress, [0, 1], ["0%", "100%"]);
  const mobileCardX = useSpring(mobileCardXRaw, { stiffness: 120, damping: 24, mass: 0.45 });

  return (
    <div ref={ref} className="relative flex items-start mb-0">
      <div className="hidden md:block w-[calc(50%-32px)] pr-8">
        {isLeft && (
          <motion.div style={{ x: cardX, opacity: cardOpacity }}>
            <JourneyCardInner item={item} />
          </motion.div>
        )}
      </div>

      <div className="hidden md:flex flex-col items-center flex-shrink-0 w-16">
        {index < journeyData.length - 1 && (
          <div className="relative w-[3px] h-44 bg-gray-200/90 dark:bg-gray-800/90 rounded-full overflow-hidden">
            <motion.div
              style={{ height: lineHeight }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-emerald-300 via-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]"
            />
          </div>
        )}
      </div>

      <div className="hidden md:block w-[calc(50%-32px)] pl-8">
        {!isLeft && (
          <motion.div style={{ x: cardX, opacity: cardOpacity }}>
            <JourneyCardInner item={item} />
          </motion.div>
        )}
      </div>

      <div className="flex md:hidden items-start gap-4 w-full pb-12">
        <div className="flex flex-col items-center flex-shrink-0">
          {index < journeyData.length - 1 && (
            <div className="relative w-[3px] flex-1 min-h-[180px] bg-gray-200/90 dark:bg-gray-800/90 rounded-full overflow-hidden">
              <motion.div
                style={{ height: lineHeight }}
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-emerald-300 via-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]"
              />
            </div>
          )}
        </div>

        <motion.div style={{ x: mobileCardX, opacity: cardOpacity }} className="flex-1 pt-1">
          <JourneyCardInner item={item} />
        </motion.div>
      </div>
    </div>
  );
};

const JourneySection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const capProgressRaw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const capProgress = useSpring(capProgressRaw, { stiffness: 132, damping: 26, mass: 0.44 });
  const capHeight = useTransform(capProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="py-24 bg-background-light dark:bg-background-dark relative z-10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <ScrollReveal>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-500">My Story</span>
              <div className="w-8 h-px bg-emerald-400" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white mb-4">
              The Journey
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.16}>
            <p className="text-gray-400 text-lg font-light max-w-md mx-auto">
              Three chapters that shaped how I think, build, and create.
            </p>
          </ScrollReveal>
        </div>

        <div className="relative">
          <div className="flex justify-center mb-0">
            <div className="relative w-[3px] h-12 bg-gray-200/90 dark:bg-gray-800/90 rounded-full overflow-hidden">
              <motion.div style={{ height: capHeight }} className="absolute top-0 left-0 w-full bg-gradient-to-b from-emerald-300 via-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            {journeyData.map((item, i) => (
              <JourneyCard key={i} item={item} index={i} />
            ))}
          </div>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-col items-center mt-2">
              <div className="w-[2px] h-8 bg-gradient-to-b from-teal-500 to-transparent" />
              <span className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">Present</span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Main Landing Page
// ─────────────────────────────────────────────
const LandingPage = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { scrollY, scrollYProgress } = useScroll();
  const mouseFrameRef = useRef(0);
  const latestMouseRef = useRef({ x: 0, y: 0 });

  // ── Hero parallax layers (now much more pronounced) ──
  // Deep bg drifts upward slowly
  const bgY = useTransform(scrollY, [0, 1200], [0, 220]);
  // Mid layer moves faster — creates clear depth separation
  const midY = useTransform(scrollY, [0, 1200], [0, 520]);
  // Hero card itself slides up and fades as user scrolls away
  const heroCardY = useTransform(scrollY, [0, 500], [0, -80]);
  const heroCardOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroCardScale = useTransform(scrollY, [0, 400], [1, 0.96]);
  const smoothHeroCardY = useSpring(heroCardY, { stiffness: 180, damping: 30, mass: 0.35 });
  const smoothHeroCardOpacity = useSpring(heroCardOpacity, { stiffness: 220, damping: 35, mass: 0.25 });
  const smoothHeroCardScale = useSpring(heroCardScale, { stiffness: 200, damping: 32, mass: 0.3 });
  const scrollHintOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  // ── Nav shrink on scroll ──
  const navBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(255,255,255,0)", "rgba(255,255,255,0.85)"]);
  const navBlur = useTransform(scrollYProgress, [0, 0.05], [0, 12]);

  // ── Mouse parallax ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const glowX = useTransform(smoothMX, [-1, 1], [-40, 40]);
  const glowY = useTransform(smoothMY, [-1, 1], [-40, 40]);

  useEffect(() => {
    const applyMouseParallax = () => {
      mouseFrameRef.current = 0;
      mouseX.set((latestMouseRef.current.x / window.innerWidth - 0.5) * 2);
      mouseY.set((latestMouseRef.current.y / window.innerHeight - 0.5) * 2);
    };

    const handleMouseMove = (e) => {
      latestMouseRef.current = { x: e.clientX, y: e.clientY };
      if (!mouseFrameRef.current) {
        mouseFrameRef.current = requestAnimationFrame(applyMouseParallax);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseFrameRef.current) {
        cancelAnimationFrame(mouseFrameRef.current);
      }
    };
  }, [mouseX, mouseY]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-primary dark:text-primary-dark selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden min-h-screen transition-colors duration-500">
      <ScrollProgress />

      {/* ── Sticky Nav with blur-in on scroll ── */}
      <motion.nav
        className="fixed top-0 w-full z-50 transition-colors duration-300"
        style={{
          backgroundColor: isDark ? "rgba(0,0,0,0)" : navBg,
          backdropFilter: `blur(${navBlur}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-center items-center h-26 pt-4">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-8"
            >
              {["Home", "Work", "Contact"].map((label, i) => (
                <motion.a
                  key={label}
                  href={label === "Home" ? "#" : `#${label.toLowerCase()}`}
                  className="text-sm font-bold uppercase tracking-widest hover:text-accent-gray transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  {label}
                </motion.a>
              ))}
              <div className="scale-75 origin-center">
                <DayNightToggle isDark={isDark} onToggle={toggleDarkMode} />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <header className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 flex justify-center items-center min-h-[90vh] overflow-hidden">
        {/* Deep Background — slowest layer */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none">
          <ConstellationBg particleCount={60} />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          {/* Hero card exits upward as user scrolls down */}
          <motion.div
            style={{ y: smoothHeroCardY, opacity: smoothHeroCardOpacity, scale: smoothHeroCardScale }}
            className="relative w-full group mx-auto transform-gpu will-change-transform"
          >
            {/* Midground blobs — faster parallax for visible depth */}
            <motion.div
              style={{ y: midY, x: glowX }}
              className="absolute -top-20 -right-20 w-96 h-[32rem] bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full blur-[100px] pointer-events-none opacity-60 transform-gpu will-change-transform"
            />
            <motion.div
              style={{ y: midY, x: glowY }}
              className="absolute -bottom-20 -left-20 w-96 h-[32rem] bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-full blur-[100px] pointer-events-none opacity-60 transform-gpu will-change-transform"
            />

            <div className="absolute -inset-6 rounded-[3rem] bg-emerald-500/20 blur-3xl pointer-events-none" />

            {/* Unified Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl shadow-black/10 dark:shadow-white/5 border border-black/5 dark:border-white/10 relative z-10 overflow-hidden flex flex-col md:flex-row items-stretch p-0"
            >
              <div className="absolute -top-12 -left-12 w-64 h-64 border-[3px] border-emerald-400/30 border-dashed rounded-full pointer-events-none" />

              {/* Left: Profile */}
              <div className="w-full md:w-2/5 relative z-20 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative flex justify-center items-center mb-6"
                >
                  <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-500 p-[3px] shadow-lg shadow-emerald-500/30">
                    <div className="w-full h-full rounded-full bg-black flex items-end justify-center overflow-hidden">
                      <img
                        src="/profile.png"
                        alt="Sky Tan"
                        loading="lazy"
                        className="h-[90%] w-auto object-contain hover:scale-105 transition-transform duration-500 origin-bottom"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="text-2xl md:text-3xl font-black text-black dark:text-white mb-2 tracking-tight text-center"
                >
                  <AnimatedName text={heroContent.name} />
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-6 text-center"
                >
                  I am an {heroContent.title}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="flex items-center gap-3"
                >
                  {[
                    { icon: "language", href: "#" },
                    { icon: "code", href: "#" },
                    { icon: "camera_alt", href: "#" },
                    { icon: "play_circle", href: "#" },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      <span className="material-icons-round text-lg">{social.icon}</span>
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              {/* Right: Content */}
              <div className="w-full md:w-3/5 flex flex-col justify-center items-center md:items-start text-center md:text-left relative z-20 p-8 md:p-12">
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full">
                  <motion.div variants={fadeUp} className="inline-block mb-6">
                    <span className="py-1.5 px-4 border border-black/10 dark:border-white/20 rounded-full text-xs font-bold uppercase tracking-widest bg-white dark:bg-white/5 backdrop-blur-sm shadow-sm">
                      Welcome to My Portfolio
                    </span>
                  </motion.div>
                  <NeonSequence />
                  <motion.p variants={fadeUp} className="text-lg md:text-xl text-accent-gray font-light mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                    Insight-driven. Impact-focused.
                  </motion.p>
                  <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => scrollToSection("projects")}
                      className="group relative bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full font-bold text-lg overflow-hidden transition-transform cursor-pointer shadow-lg shadow-black/10 dark:shadow-white/5"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        View Work <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => scrollToSection("contact")}
                      className="px-8 py-3.5 rounded-full font-bold text-lg border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Contact Me
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      href="/Resume.pdf"
                      download
                      className="px-8 py-3.5 rounded-full font-bold text-lg border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer inline-flex items-center justify-center"
                    >
                      My Resume
                    </motion.a>
                  </motion.div>
                </motion.div>
              </div>

              <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 border-t-[3px] border-r-[3px] border-emerald-400/40 border-dashed rounded-tr-[3rem] pointer-events-none opacity-50" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint — fades out once user scrolls */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </header>

      {/* ── Velocity Marquee between sections ── */}
      <VelocityMarquee baseVelocity={2.5} />

      <JourneySection />

      <Divider />

      {/* ════════════════════════════════════════
          EXPERTISE SECTION
      ════════════════════════════════════════ */}
      <section className="py-24 bg-surface-light dark:bg-surface-dark relative z-10 overflow-hidden">
        {/* Matrix rain drifts at a different speed for depth */}
        <ParallaxLayer speed={0.25} className="absolute -top-32 -bottom-32 left-0 right-0 pointer-events-none">
          <MatrixRain fontSize={14} />
        </ParallaxLayer>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <SectionLabel label="What I Do" />

          <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-4">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white">
                Core Expertise
              </h2>
              <motion.div
                className="h-1 w-0 bg-black dark:bg-white mt-4"
                whileInView={{ width: 80 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </ScrollReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expertise.map((item, i) => (
              <ExpertiseCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ════════════════════════════════════════
          PROJECTS SECTION
      ════════════════════════════════════════ */}
      <section id="projects" className="py-24 relative z-10 bg-background-light dark:bg-background-dark overflow-hidden">
        {/* Parallax blobs — clearly visible depth */}
        <ParallaxLayer speed={0.4} className="absolute top-40 left-10 w-72 h-72 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 rounded-full blur-[120px] opacity-40" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.55} className="absolute bottom-40 right-10 w-96 h-96 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-bl from-gray-100 to-gray-300 dark:from-gray-800 dark:to-black rounded-full blur-[150px] opacity-40" />
        </ParallaxLayer>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20">
          <SectionLabel label="Selected Work" />

          <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <ScrollReveal>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white">
                  Selected Work
                </h2>
                <motion.div
                  className="h-1 w-0 bg-black dark:bg-white mt-4"
                  whileInView={{ width: 80 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.1} direction="left">
              <motion.button
                whileHover={{ x: 4 }}
                className="hidden md:flex items-center gap-2 font-bold text-sm uppercase tracking-widest hover:text-accent-gray transition-colors cursor-pointer"
              >
                View All <span className="material-icons-round text-base">arrow_forward</span>
              </motion.button>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>

          <div className="mt-12 md:hidden">
            <ScrollReveal>
              <button className="w-full py-4 border border-black/10 dark:border-white/20 rounded-full font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                View All Projects
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Divider />

      {/* ════════════════════════════════════════
          FOOTER / CTA
      ════════════════════════════════════════ */}
      <footer id="contact" className="py-24 border-t border-black/5 dark:border-white/10 text-center bg-surface-light dark:bg-surface-dark relative overflow-hidden">
        <ParallaxLayer speed={0.2} className="absolute -inset-y-40 inset-x-0 pointer-events-none">
          <ConstellationBg particleCount={35} />
        </ParallaxLayer>

        <div className="relative z-10">
          {/* Large text with split reveal */}
          <div className="overflow-hidden mb-4">
            <motion.h2
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 0.08 }}
              viewport={{ once: false }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter select-none text-black dark:text-white"
            >
              GET IN TOUCH
            </motion.h2>
          </div>

          <ScrollReveal delay={0.25}>
            <motion.button
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("contact")}
              className="bg-black text-white dark:bg-white dark:text-black px-10 py-5 rounded-full font-bold text-xl cursor-pointer shadow-xl shadow-black/20 dark:shadow-white/10"
            >
              Let's Build Something
            </motion.button>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <p className="mt-6 text-sm text-gray-400 font-medium">
              Available for freelance & full-time opportunities
            </p>
          </ScrollReveal>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;