import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useDarkMode from "../hooks/useDarkMode";
import DayNightToggle from "../components/DayNightToggle";
import { heroContent, expertise, projects } from "../data/portfolio";

// --- Monochrome Glitch Component ---
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
      if (animationState === "pulse") {
        setTypedSubtitle(fullSubtitle);
      } else {
        setTypedSubtitle("");
      }
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
    <div className="relative z-10 mb-10 w-full group">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 dark:from-white/10 dark:to-gray-800 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative bg-surface-light dark:bg-surface-dark ring-1 ring-black/5 dark:ring-white/10 rounded-3xl p-8 sm:p-12 overflow-hidden neon-hero-container">
        
        {/* Subtle Inner Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black/5 dark:bg-white/5 rounded-full blur-[80px] transition-opacity duration-1000 ${animationState === "pulse" ? "opacity-30" : "opacity-0"}`}></div>
        
        <div className="flex flex-col justify-center min-h-[180px] z-20 relative text-center sm:text-left">
          <h1 className={`font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tighter mb-4 transition-all duration-300 text-black dark:text-white 
            ${animationState === "glitch" ? "blur-[1px] translate-x-1" : ""}
          `}>
            {welcomingText || "Welcome to my portfolio!"}
          </h1>
          
          <h2 className="font-sans text-xl sm:text-3xl text-accent-gray tracking-wide h-10">
            {animationState === "phase2" || animationState === "pulse" ? (
              <span className="border-r-2 border-black dark:border-white pr-1 animate-pulse">
                {typedSubtitle}
              </span>
            ) : (
              <span className="opacity-0">{heroContent?.tagline ?? ""}</span>
            )}
          </h2>
        </div>
      </div>
    </div>
  );
};

// --- Main Landing Page ---
const LandingPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-primary dark:text-primary-dark selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden min-h-screen transition-colors duration-500">
      
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 pt-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-8"
            >
              <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-accent-gray transition-colors">Home</a>
              <a href="#projects" className="text-sm font-bold uppercase tracking-widest hover:text-accent-gray transition-colors">Work</a>
              <a href="#contact" className="text-sm font-bold uppercase tracking-widest hover:text-accent-gray transition-colors">Contact</a>
              <div className="scale-75 origin-center">
                <DayNightToggle isDark={isDark} onToggle={toggleDarkMode} />
              </div>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            
            {/* Left Column: Intro */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
              <motion.div variants={fadeUp} className="inline-block mb-6">
                 <span className="py-1 px-3 border border-black/10 dark:border-white/20 rounded-full text-xs font-bold uppercase tracking-widest bg-white dark:bg-white/5 backdrop-blur-sm">
                   Welcome to My Portfolio
                 </span>
              </motion.div>
              
              <NeonSequence />
              
              <motion.p variants={fadeUp} className="text-xl md:text-2xl text-accent-gray font-light mb-10 leading-relaxed max-w-lg">
                Insight-driven. Impact-focused.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate("/projects")} className="group relative bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-transform active:scale-95 cursor-pointer">
                  <span className="relative z-10 flex items-center justify-center gap-2">View Work <span className="group-hover:translate-x-1 transition-transform">→</span></span>
                </button>
                <button onClick={() => navigate("/contact")} className="px-8 py-4 rounded-full font-bold text-lg border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                  Contact Me
                </button>
              </motion.div>
            </motion.div>

            {/* Right Column: Profile Image (Restored Dashboard Layout) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="mt-16 lg:mt-0 relative"
            >
              {/* Background Blobs (Monochrome) */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-gray-200 dark:bg-gray-800 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gray-300 dark:bg-gray-900 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
              
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative transition-colors duration-500"
              >
                <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl shadow-black/10 dark:shadow-white/5 border border-black/5 dark:border-white/10 relative overflow-hidden max-w-md mx-auto flex items-center pr-2">
                  
                  {/* Decorative Dashed Circle Top Left (Restored - Gray) */}
                  <div className="absolute -top-12 -left-12 w-64 h-64 border-[3px] border-gray-300 dark:border-gray-700 border-dashed rounded-full pointer-events-none"></div>

                  {/* Content (Left Side) */}
                  <div className="flex-1 flex flex-col items-start text-left relative z-20 py-8 pl-8 pr-2">
                    <h2 className="text-3xl font-black text-black dark:text-white mb-2 tracking-tight">
                      {heroContent.name}
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                       I am an {heroContent.title}<br /> 
                       {heroContent.tagline}
                    </p>

                    {/* Social Icons (Compressed) */}
                    <div className="flex items-center gap-3">
                      {[
                        { icon: "language", href: "#" },
                        { icon: "code", href: "#" },
                        { icon: "camera_alt", href: "#" },
                        { icon: "play_circle", href: "#" },
                      ].map((social, i) => (
                        <a
                          key={i}
                          href={social.href}
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                          <span className="material-icons-round text-base">
                            {social.icon}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Profile Image (Restored Layout) */}
                  <div className="relative w-[42%] h-64 flex justify-center items-center mx-auto">
                    <img
                      src="/profile.png"
                      alt="Sky Tan"
                      className="h-full w-auto object-contain grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                      style={{
                        maskImage:
                          "linear-gradient(to bottom, black 85%, transparent 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black 85%, transparent 100%)",
                      }}
                    />
                  </div>

                  {/* Bottom Left Dashed decorative (Restored - Gray) */}
                  <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 border-t-[3px] border-r-[3px] border-gray-300 dark:border-gray-700 border-dashed rounded-tr-[3rem] pointer-events-none opacity-50"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Expertise Section (Formerly SDG Stats) */}
      <section className="py-24 bg-surface-light dark:bg-surface-dark relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-black dark:text-white">
              Core Expertise
            </motion.h2>
            <motion.div variants={fadeUp} className="h-1 w-20 bg-black dark:bg-white"></motion.div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expertise.map((item) => (
              <motion.div
                key={item.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white dark:bg-background-dark border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 group"
              >
                <item.icon className="w-10 h-10 mb-6 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{item.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-black dark:text-white">{item.stat}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{item.statLabel}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Projects (Formerly Key Benefits) */}
      <section id="projects" className="py-24 relative z-10 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
          >
            <div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-black dark:text-white">
                Selected Work
              </motion.h2>
              <motion.div variants={fadeUp} className="h-1 w-20 bg-black dark:bg-white"></motion.div>
            </div>
            <motion.button variants={fadeUp} className="hidden md:flex items-center gap-2 font-bold text-sm uppercase tracking-widest hover:text-accent-gray transition-colors cursor-pointer">
              View All <span className="material-icons-round text-base">arrow_forward</span>
            </motion.button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gray-100 dark:bg-surface-dark rounded-2xl overflow-hidden mb-6 border border-black/5 dark:border-white/10">
                   {/* Placeholder for project image */}
                   <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-black group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                      <project.icon className="w-12 h-12 text-gray-300 dark:text-gray-600" strokeWidth={1} />
                   </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-black dark:text-white group-hover:underline decoration-2 underline-offset-4">{project.title}</h3>
                    <p className="text-accent-gray text-sm mb-3">{project.category}</p>
                    <p className="text-sm text-gray-500 max-w-xs">{project.description}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
                    <span className="material-icons-round text-sm">arrow_outward</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
           {/* Mobile View All Button */}
           <div className="mt-12 md:hidden">
            <button className="w-full py-4 border border-black/10 dark:border-white/20 rounded-full font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                View All Projects
            </button>
           </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer id="contact" className="py-20 border-t border-black/5 dark:border-white/10 text-center bg-surface-light dark:bg-surface-dark">
         <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter opacity-10 mb-10 select-none text-black dark:text-white">GET IN TOUCH</h2>
         <button 
           onClick={() => navigate("/contact")}
           className="bg-black text-white dark:bg-white dark:text-black px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform cursor-pointer shadow-xl shadow-black/20 dark:shadow-white/10"
         >
           Let's Build Something
         </button>
      </footer>

    </div>
  );
};

export default LandingPage;
