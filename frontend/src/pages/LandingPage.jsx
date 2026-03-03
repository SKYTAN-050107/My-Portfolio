import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useDarkMode from '../hooks/useDarkMode';
import DayNightToggle from '../components/DayNightToggle';

const NeonSequence = () => {
    const [animationState, setAnimationState] = React.useState('initial');

    React.useEffect(() => {
        let timers = [];
        const startSequence = () => {
            setAnimationState('phase1');
            timers.push(setTimeout(() => setAnimationState('phase2'), 2000));
            timers.push(setTimeout(() => setAnimationState('pulse'), 4000));
            timers.push(setTimeout(() => setAnimationState('glitch'), 8000));
            timers.push(setTimeout(() => setAnimationState('dark'), 9000));
            timers.push(setTimeout(() => startSequence(), 10500));
        };
        const t = setTimeout(startSequence, 100);
        timers.push(t);
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="relative z-10 mb-10 w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0B0E14] ring-1 ring-gray-900/5 rounded-3xl p-8 sm:p-12 overflow-hidden neon-hero-container">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 rounded-full blur-[80px] transition-all duration-1000 ${animationState === 'pulse' ? 'opacity-30' : 'opacity-0'}`}></div>
                <div className="flex flex-col justify-center min-h-[180px] z-20 relative text-center sm:text-left">
                    <h1 className={`font-neon-sans text-5xl sm:text-7xl font-bold tracking-wider mb-4 transition-all duration-300 ${animationState === 'initial' ? 'opacity-0' : ''} ${animationState === 'phase1' ? 'animate-flicker-cyan' : ''} ${(animationState === 'phase2' || animationState === 'pulse') ? 'neon-cyan group-hover:animate-flicker-cyan-loop' : ''} ${animationState === 'pulse' ? 'animate-pulse-cyan' : ''} ${animationState === 'glitch' ? 'neon-cyan opacity-50 blur-[2px]' : ''} ${animationState === 'dark' ? 'text-gray-800 opacity-20' : ''}`}>
                        I AM SKY
                    </h1>
                    <h2 className={`font-neon-script text-3xl sm:text-5xl transition-all duration-300 ${(animationState === 'initial' || animationState === 'phase1') ? 'opacity-0' : ''} ${(animationState === 'phase2' || animationState === 'pulse') ? 'neon-pink' : ''} ${animationState === 'pulse' ? 'animate-pulse-pink' : ''} ${animationState === 'glitch' ? 'opacity-0 scale-95 duration-100' : ''} ${animationState === 'dark' ? 'opacity-0' : ''}`}>
                        <span
                            className={`neon-writing inline-block align-top ${animationState === 'phase2' ? 'animate-neon-write-pink' : ''} ${animationState === 'pulse' ? 'neon-writing-done' : ''}`}
                        >
                            Welcome to my portfolio
                        </span>
                    </h2>
                </div>
            </div>
        </div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const { isDark, toggleDarkMode } = useDarkMode();

    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    return (
        <div className="font-display bg-background-light dark:bg-emerald-950 text-emerald-950 dark:text-emerald-50 selection:bg-primary/30 overflow-hidden transition-colors duration-500">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-background-light/90 dark:bg-emerald-950/90 backdrop-blur-xl border-b border-emerald-900/10 dark:border-white/10 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-14 sm:h-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 group cursor-pointer"
                        >
                            <img
                                src="/logo.jpg"
                                alt="Logo"
                                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl transition-transform group-hover:scale-110"
                            />
                            <span className="text-base sm:text-xl font-bold tracking-tight text-emerald-900 dark:text-white group-hover:text-primary transition-colors duration-500">Recycle<span className="text-primary">Now</span></span>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="hidden md:flex items-center space-x-8"
                        >
                            <a href="#" className="text-emerald-800 dark:text-emerald-100/70 hover:text-primary dark:hover:text-primary transition-colors duration-500 font-bold text-sm uppercase tracking-wider">Services</a>
                            <a href="#" className="text-emerald-800 dark:text-emerald-100/70 hover:text-primary dark:hover:text-primary transition-colors duration-500 font-bold text-sm uppercase tracking-wider">Impact</a>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <DayNightToggle isDark={isDark} onToggle={toggleDarkMode} />
                            <button
                                onClick={() => navigate('/login')}
                                className="text-emerald-800 dark:text-emerald-200 font-bold hover:text-primary transition-colors duration-500 cursor-pointer text-sm sm:text-base"
                            >
                                Login
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/signup')}
                                className="bg-primary text-emerald-950 px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-primary/40 transition-all cursor-pointer border border-primary/50"
                            >
                                Get Started
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-16 pb-24 lg:pt-32 lg:pb-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="max-w-xl"
                        >
                            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-emerald-800 dark:text-primary text-xs font-bold mb-6 tracking-wide uppercase transition-colors duration-500">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                KITA_HACK 2026 Winner
                            </motion.div>
                            <NeonSequence />
                            <motion.p variants={fadeUp} className="text-lg text-emerald-700 dark:text-emerald-100/70 mb-10 leading-relaxed font-medium transition-colors duration-500">
                                Transforming ideas into digital reality with cutting-edge web technologies and creative design.
                            </motion.p>
                            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/projects')}
                                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-emerald-950 px-8 py-4 rounded-2xl font-extrabold text-lg shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-50 dark:border-white/20"
                                >
                                    View Projects <span className="material-icons-round">arrow_forward</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/contact')}
                                    className="bg-white/60 dark:bg-white/10 backdrop-blur-xl text-emerald-900 dark:text-white px-8 py-4 rounded-2xl font-extrabold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-200 dark:border-white/20 hover:border-cyan-400 dark:hover:border-cyan-400"
                                >
                                    Contact Me <span className="material-icons-round">mail</span>
                                </motion.button>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, type: "spring" }}
                            className="mt-16 lg:mt-0 relative"
                        >
                            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/50 border border-emerald-900/10 dark:border-white/10 transition-colors duration-500"
                            >
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBANfeQgyqMcHvCEdzZR3dsYrQmDS192ub78mmEbI6DkB9QJvfW85bzhPEHsZFN4bH0rrmnAJ6QrWv0KcXS7NkvoSvMLLIW3OSkch5NZA21i22vg9q6xIhPppYSSoebXNrK9AIELKkUZqbFm7d6ONbCtpe2R7XhEfbsq8AEgCfsnktC9maqj5borMJHYClr2D9p9PdDUsrR9EqDk_3sdsi9mtHSagRu2LyrSfIR6rBd2ETLDi98gjJdSxw9KuClQIBVzltZbxTfVWS9" alt="Sustainable Living" className="w-full h-[500px] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 dark:from-emerald-950/80 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-emerald-900/10 dark:border-white/20 p-6 rounded-2xl flex items-center gap-4 transition-colors duration-500">
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/30">
                                        <span className="material-icons-round">qr_code_scanner</span>
                                    </div>
                                    <div>
                                        <p className="text-emerald-950 dark:text-white font-bold transition-colors duration-500">AI Scanner Active</p>
                                        <p className="text-emerald-900/70 dark:text-emerald-100/70 text-sm transition-colors duration-500">Identifying recyclable materials in real-time</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* SDG 12 Impact Stats */}
            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={staggerContainer}
                        className="text-center mb-12"
                    >
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-emerald-800 dark:text-primary text-xs font-bold mb-4 tracking-wide uppercase transition-colors duration-500">
                            <span className="material-icons-round text-sm">public</span>
                            SDG 12 · Responsible Consumption
                        </motion.div>
                        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-emerald-900 dark:text-white tracking-tight transition-colors duration-500">
                            Why It Matters
                        </motion.h2>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={staggerContainer}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {[
                            { value: '65%', label: 'JB Non-Recycling Rate', icon: 'delete', color: 'text-red-500' },
                            { value: '8M+', label: 'Tonnes Waste / Year (MY)', icon: 'warning', color: 'text-amber-500' },
                            { value: '70%', label: 'Boost With Proper Sorting', icon: 'trending_up', color: 'text-primary' },
                            { value: '∞', label: 'Glass Is Infinitely Recyclable', icon: 'recycling', color: 'text-primary' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                whileHover={{ y: -6, scale: 1.02 }}
                                className="p-8 rounded-3xl border border-emerald-100 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl text-center transition-all duration-500"
                            >
                                <span className={`material-icons-round text-3xl mb-3 ${stat.color}`}>{stat.icon}</span>
                                <p className="text-4xl font-black text-emerald-900 dark:text-white tracking-tight transition-colors duration-500">{stat.value}</p>
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-100/60 mt-2 transition-colors duration-500">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Key Benefits Section */}
            <section className="py-24 bg-white dark:bg-black/20 border-y border-emerald-100 dark:border-white/5 relative z-10 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: 'local_shipping', title: 'Smart Pickups', desc: 'Schedule a collection in seconds. We handle everything efficiently.' },
                            { icon: 'center_focus_weak', title: 'AI Classification', desc: 'Aim your camera at trash and get instant bin recommendations.' },
                            { icon: 'redeem', title: 'Eco-Rewards', desc: 'Exchange recycling points for exclusive discounts at local partners.' }
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="p-10 rounded-3xl border border-emerald-100 dark:border-white/10 bg-background-light dark:bg-white/5 backdrop-blur-xl hover:shadow-2xl hover:shadow-emerald-900/10 dark:hover:shadow-black/50 transition-all duration-500 group"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-emerald-950 transition-colors border border-primary/20">
                                    <span className="material-icons-round text-3xl">{benefit.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-900 dark:text-white mb-4 tracking-tight transition-colors duration-500">{benefit.title}</h3>
                                <p className="text-emerald-700 dark:text-emerald-100/60 leading-relaxed font-medium transition-colors duration-500">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden text-emerald-950">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, type: 'spring' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"
                ></motion.div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-gradient-to-br from-primary to-emerald-400 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-primary/20 dark:shadow-primary/10 border border-emerald-50 dark:border-white/40 transition-colors duration-500"
                    >
                        <div className="max-w-xl text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-emerald-950">Ready to make an impact?</h2>
                            <p className="font-bold text-emerald-900/80 text-xl">Join thousands of others making a real difference. Sign up today and get your first pickup free.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/signup')}
                                className="bg-emerald-950 text-white px-10 py-5 rounded-2xl font-extrabold text-xl shadow-2xl hover:shadow-black/50 transition-all cursor-pointer border border-emerald-800"
                            >
                                Join Currently
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
