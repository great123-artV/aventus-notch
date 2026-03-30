import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

// Animated SVG trading chart lines
function TradingLines() {
  const lines = useMemo(() => {
    const result: { points: string; delay: number; duration: number; opacity: number; color: string }[] = [];
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--accent))",
      "hsl(var(--profit))",
      "hsl(75 80% 50% / 0.3)",
      "hsl(152 82% 45% / 0.2)",
    ];

    for (let i = 0; i < 6; i++) {
      const pts: string[] = [];
      const baseY = 120 + i * 80;
      let x = 0;
      while (x <= 1400) {
        const y = baseY + Math.sin(x * 0.008 + i * 1.5) * 40 + Math.cos(x * 0.015 + i) * 20 + (Math.random() - 0.5) * 30;
        pts.push(`${x},${y}`);
        x += 20 + Math.random() * 15;
      }
      result.push({
        points: pts.join(" "),
        delay: i * 0.4,
        duration: 3 + i * 0.3,
        opacity: 0.08 + (5 - i) * 0.04,
        color: colors[i % colors.length],
      });
    }
    return result;
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1400 700"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        {lines.map((_, i) => (
          <linearGradient key={`grad-${i}`} id={`line-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lines[i].color} stopOpacity="0" />
            <stop offset="20%" stopColor={lines[i].color} stopOpacity="1" />
            <stop offset="80%" stopColor={lines[i].color} stopOpacity="1" />
            <stop offset="100%" stopColor={lines[i].color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {lines.map((line, i) => (
        <motion.polyline
          key={i}
          points={line.points}
          stroke={`url(#line-grad-${i})`}
          strokeWidth={i === 0 ? 2.5 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={line.opacity}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: line.opacity }}
          transition={{
            pathLength: { duration: line.duration, ease: "easeInOut", delay: line.delay },
            opacity: { duration: 1, delay: line.delay },
          }}
        />
      ))}

      {/* Animated glow dot on first line */}
      {lines[0] && (
        <motion.circle
          r="4"
          fill="hsl(var(--primary))"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path={`M${lines[0].points.split(" ").map(p => p.replace(",", " ")).join(" L ")}`}
          />
        </motion.circle>
      )}

      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

// Canvas particle field
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    }

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? "160,220,80" : "16,185,129",
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      const w = W(), h = H();

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(160,220,80,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// Animated candlestick bars
function CandlestickBars() {
  const bars = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const isGreen = Math.random() > 0.4;
      const height = 30 + Math.random() * 100;
      const wickHeight = height + 10 + Math.random() * 30;
      return { x: 30 + i * 45, height, wickHeight, isGreen, delay: i * 0.06 };
    });
  }, []);

  return (
    <svg
      className="absolute bottom-0 left-0 w-full h-[40%] pointer-events-none"
      viewBox="0 0 1400 200"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
    >
      {bars.map((bar, i) => (
        <g key={i}>
          {/* Wick */}
          <motion.line
            x1={bar.x + 8}
            y1={200 - bar.wickHeight}
            x2={bar.x + 8}
            y2={200}
            stroke={bar.isGreen ? "hsl(var(--profit))" : "hsl(var(--loss))"}
            strokeWidth="1"
            opacity="0.15"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: bar.delay, ease: "easeOut" }}
            style={{ transformOrigin: `${bar.x + 8}px 200px` }}
          />
          {/* Body */}
          <motion.rect
            x={bar.x}
            y={200 - bar.height}
            width="16"
            height={bar.height}
            rx="2"
            fill={bar.isGreen ? "hsl(var(--profit))" : "hsl(var(--loss))"}
            opacity="0.08"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: bar.delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${bar.x}px 200px` }}
          />
        </g>
      ))}
      {/* Gradient fade at bottom */}
      <defs>
        <linearGradient id="fade-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="hsl(220 20% 4%)" />
        </linearGradient>
      </defs>
      <rect x="0" y="160" width="1400" height="40" fill="url(#fade-bottom)" />
    </svg>
  );
}

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated trading chart lines */}
      <TradingLines />

      {/* Candlestick bars at bottom */}
      <CandlestickBars />

      {/* Particle field */}
      <ParticleField />

      {/* Radial vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 30%, hsl(220 20% 4% / 0.7) 80%)",
        }}
      />
    </div>
  );
}
