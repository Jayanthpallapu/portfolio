'use client';

import { useEffect, useRef } from 'react';

/**
 * Liquid Blue Flow Background (Dynamic HSL Theme-based)
 * Creates a mesmerizing, organic liquid gradient animation
 * with smooth undulating waves, soft internal glow, and deep flow,
 * bound dynamically to the current website theme hue.
 */

interface FlowBlob {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  speedX: number;
  speedY: number;
  phase: number;
  phaseSpeed: number;
  hueOffset: number;
  saturation: number;
  lightness: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const blobsRef = useRef<FlowBlob[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.width;
    const h = () => canvas.height;

    // Create flowing blobs with custom hue offsets and HSL styling
    const blobConfigs = [
      // Large primary blobs
      {
        x: 0.3, y: 0.4, radiusX: 0.45, radiusY: 0.5,
        speedX: 0.0003, speedY: 0.0002, phase: 0,
        phaseSpeed: 0.0008, hueOffset: 20, saturation: 64, lightness: 33, opacity: 0.7,
        pulseSpeed: 0.0005, pulsePhase: 0,
      },
      {
        x: 0.7, y: 0.5, radiusX: 0.4, radiusY: 0.45,
        speedX: -0.0002, speedY: 0.0003, phase: 2,
        phaseSpeed: 0.0006, hueOffset: 20, saturation: 76, lightness: 48, opacity: 0.65,
        pulseSpeed: 0.0004, pulsePhase: 1.5,
      },
      // Medium blobs
      {
        x: 0.5, y: 0.3, radiusX: 0.35, radiusY: 0.3,
        speedX: 0.0004, speedY: -0.0002, phase: 1,
        phaseSpeed: 0.001, hueOffset: 20, saturation: 83, lightness: 53, opacity: 0.5,
        pulseSpeed: 0.0006, pulsePhase: 0.8,
      },
      {
        x: 0.2, y: 0.7, radiusX: 0.3, radiusY: 0.35,
        speedX: -0.0003, speedY: -0.0001, phase: 3,
        phaseSpeed: 0.0007, hueOffset: 20, saturation: 91, lightness: 60, opacity: 0.45,
        pulseSpeed: 0.0005, pulsePhase: 2.2,
      },
      // Glowing accent blobs
      {
        x: 0.6, y: 0.6, radiusX: 0.25, radiusY: 0.2,
        speedX: 0.0005, speedY: 0.0003, phase: 0.5,
        phaseSpeed: 0.0012, hueOffset: 0, saturation: 86, lightness: 46, opacity: 0.4,
        pulseSpeed: 0.0007, pulsePhase: 3.0,
      },
      {
        x: 0.4, y: 0.2, radiusX: 0.2, radiusY: 0.25,
        speedX: -0.0004, speedY: 0.0004, phase: 1.5,
        phaseSpeed: 0.0009, hueOffset: -10, saturation: 95, lightness: 43, opacity: 0.35,
        pulseSpeed: 0.0008, pulsePhase: 1.0,
      },
      // Bright highlight blobs
      {
        x: 0.5, y: 0.5, radiusX: 0.15, radiusY: 0.18,
        speedX: 0.0002, speedY: -0.0003, phase: 2.5,
        phaseSpeed: 0.0015, hueOffset: 0, saturation: 95, lightness: 60, opacity: 0.5,
        pulseSpeed: 0.001, pulsePhase: 0.3,
      },
      {
        x: 0.8, y: 0.3, radiusX: 0.18, radiusY: 0.15,
        speedX: -0.0003, speedY: 0.0002, phase: 4,
        phaseSpeed: 0.001, hueOffset: 0, saturation: 98, lightness: 39, opacity: 0.4,
        pulseSpeed: 0.0006, pulsePhase: 4.0,
      },
      // Deep dark undertone blobs
      {
        x: 0.15, y: 0.3, radiusX: 0.3, radiusY: 0.35,
        speedX: 0.0001, speedY: 0.0001, phase: 5,
        phaseSpeed: 0.0005, hueOffset: 20, saturation: 57, lightness: 21, opacity: 0.6,
        pulseSpeed: 0.0003, pulsePhase: 2.0,
      },
      {
        x: 0.85, y: 0.7, radiusX: 0.28, radiusY: 0.25,
        speedX: -0.0002, speedY: -0.0002, phase: 1.2,
        phaseSpeed: 0.0006, hueOffset: 40, saturation: 45, lightness: 20, opacity: 0.55,
        pulseSpeed: 0.0004, pulsePhase: 3.5,
      },
      // Electric neon accent
      {
        x: 0.5, y: 0.45, radiusX: 0.12, radiusY: 0.1,
        speedX: 0.0006, speedY: 0.0004, phase: 3.5,
        phaseSpeed: 0.002, hueOffset: -10, saturation: 100, lightness: 50, opacity: 0.25,
        pulseSpeed: 0.0012, pulsePhase: 0.5,
      },
    ];

    blobsRef.current = blobConfigs.map((config) => ({
      x: config.x * w(),
      y: config.y * h(),
      radiusX: config.radiusX * Math.max(w(), h()),
      radiusY: config.radiusY * Math.max(w(), h()),
      speedX: config.speedX,
      speedY: config.speedY,
      phase: config.phase,
      phaseSpeed: config.phaseSpeed,
      hueOffset: config.hueOffset,
      saturation: config.saturation,
      lightness: config.lightness,
      opacity: config.opacity,
      pulseSpeed: config.pulseSpeed,
      pulsePhase: config.pulsePhase,
    }));

    // Helper to get active theme hue from CSS variables
    const getThemeHue = () => {
      if (typeof window === 'undefined') return 200;
      const val = getComputedStyle(document.documentElement).getPropertyValue('--theme-hue');
      return val ? parseInt(val.trim(), 10) : 200;
    };

    // Helper to convert HSL to RGB
    const hslToRgb = (h: number, s: number, l: number) => {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
      return {
        r: Math.round(255 * f(0)),
        g: Math.round(255 * f(8)),
        b: Math.round(255 * f(4)),
      };
    };

    const animate = () => {
      timeRef.current += 1;
      const t = timeRef.current;
      const cw = w();
      const ch = h();

      // Read current dynamic theme hue
      const themeHue = getThemeHue();

      // Dark base
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, cw, ch);

      // Set composite for additive-like blending
      ctx.globalCompositeOperation = 'screen';

      const blobs = blobsRef.current;

      for (const blob of blobs) {
        // Organic movement using sine waves
        const moveX = Math.sin(t * blob.speedX + blob.phase) * cw * 0.15
                     + Math.sin(t * blob.speedX * 1.7 + blob.phase * 0.5) * cw * 0.08;
        const moveY = Math.cos(t * blob.speedY + blob.phase) * ch * 0.12
                     + Math.cos(t * blob.speedY * 1.3 + blob.phase * 0.7) * ch * 0.06;

        const cx = blob.x + moveX;
        const cy = blob.y + moveY;

        // Pulsing radius
        const pulse = 1 + 0.15 * Math.sin(t * blob.pulseSpeed + blob.pulsePhase);
        const rx = blob.radiusX * pulse;
        const ry = blob.radiusY * pulse;

        // Calculate dynamic RGB matching active lightning hue
        const rgb = hslToRgb((themeHue + blob.hueOffset) % 360, blob.saturation, blob.lightness);

        // Draw multiple layered gradients per blob for rich, smooth blending
        // Layer 1: Wide soft outer glow
        const outerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry) * 1.5);
        outerGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${blob.opacity * 0.3})`);
        outerGrad.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${blob.opacity * 0.15})`);
        outerGrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 1.5, ry * 1.5, Math.sin(t * 0.0003 + blob.phase) * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = outerGrad;
        ctx.fill();

        // Layer 2: Core blob with richer color
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry) * 0.8);
        coreGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${blob.opacity * 0.6})`);
        coreGrad.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${blob.opacity * 0.35})`);
        coreGrad.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${blob.opacity * 0.1})`);
        coreGrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 0.8, ry * 0.8, Math.cos(t * 0.0002 + blob.phase) * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // Layer 3: Bright center highlight for inner glow
        if (blob.opacity > 0.35) {
          const highlightGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry) * 0.3);
          highlightGrad.addColorStop(0, `rgba(${Math.min(rgb.r + 60, 255)}, ${Math.min(rgb.g + 60, 255)}, ${Math.min(rgb.b + 40, 255)}, ${blob.opacity * 0.4})`);
          highlightGrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

          ctx.beginPath();
          ctx.ellipse(cx, cy, rx * 0.3, ry * 0.3, 0, 0, Math.PI * 2);
          ctx.fillStyle = highlightGrad;
          ctx.fill();
        }
      }

      // Reset composite
      ctx.globalCompositeOperation = 'source-over';

      // Vignette overlay for depth
      const vignetteGrad = ctx.createRadialGradient(
        cw / 2, ch / 2, Math.min(cw, ch) * 0.2,
        cw / 2, ch / 2, Math.max(cw, ch) * 0.8
      );
      vignetteGrad.addColorStop(0, 'rgba(2, 6, 23, 0)');
      vignetteGrad.addColorStop(0.6, 'rgba(2, 6, 23, 0.1)');
      vignetteGrad.addColorStop(1, 'rgba(2, 6, 23, 0.5)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Top and bottom fade for seamless section blending
      const topFade = ctx.createLinearGradient(0, 0, 0, ch * 0.15);
      topFade.addColorStop(0, 'rgba(10, 10, 26, 0.6)');
      topFade.addColorStop(1, 'rgba(10, 10, 26, 0)');
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, cw, ch * 0.15);

      const bottomFade = ctx.createLinearGradient(0, ch * 0.85, 0, ch);
      bottomFade.addColorStop(0, 'rgba(10, 10, 26, 0)');
      bottomFade.addColorStop(1, 'rgba(10, 10, 26, 0.8)');
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, ch * 0.85, cw, ch * 0.15);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 animate-fade-in"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
