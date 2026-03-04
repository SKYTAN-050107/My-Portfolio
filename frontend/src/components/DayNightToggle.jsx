import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function DayNightToggle({ isDark, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className={`
        relative h-10 w-20 rounded-full p-1 cursor-pointer 
        transition-colors duration-500 border border-black/10 dark:border-white/20
        ${isDark ? "bg-black" : "bg-white"}
      `}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Dark Mode"
    >
      {/* Background Icons (Static) */}
      <div className="absolute inset-0 flex justify-between items-center px-2.5 text-xs font-bold pointer-events-none">
        <span className={`transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-100 text-gray-300"}`}>
            <Moon size={14} />
        </span>
        <span className={`transition-opacity duration-300 ${isDark ? "opacity-100 text-gray-700" : "opacity-0"}`}>
            <Sun size={14} />
        </span>
      </div>

      {/* Sliding Knob */}
      <motion.div
        className={`
          flex items-center justify-center w-8 h-8 rounded-full shadow-lg
          transition-colors duration-500
          ${isDark ? "bg-white text-black" : "bg-black text-white"}
        `}
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30
        }}
        style={{
          // Use justify-start (default) vs justify-end logic via margin
          marginLeft: isDark ? "auto" : "0",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={16} fill="currentColor" className="text-black" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={16} fill="currentColor" className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
