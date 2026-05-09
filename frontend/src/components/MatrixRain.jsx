import { useEffect, useRef } from "react";

/**
 * Monochrome matrix rain canvas.
 * Renders falling characters behind a section.
 * Uses black characters on light mode, white on dark mode.
 *
 * Props:
 *   fontSize  — character size in px (default 12)
 *   className — extra classes for wrapping canvas
 */
export default function MatrixRain({ fontSize = 12, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let raf = 0;
    let isVisible = true;
    let isInViewport = true;
    let columns = 0;
    let drops = [];
    let width = 0;
    let height = 0;

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1).map(() => Math.random() * -100);
    };

    resize();

    let lastTime = 0;
    const interval = 90;

    const draw = (now) => {
      if (!isVisible || !isInViewport) {
        raf = requestAnimationFrame(draw);
        return;
      }

      raf = requestAnimationFrame(draw);
      if (now - lastTime < interval) return;
      lastTime = now;

      const isDark = document.documentElement.classList.contains("dark");

      // Semi-transparent overlay for trail effect
      ctx.fillStyle = isDark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );

    observer.observe(canvas);

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, [fontSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`matrix-canvas ${className}`}
    />
  );
}
