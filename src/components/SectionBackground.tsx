'use client';

import { useEffect, useRef } from 'react';

export type BackgroundVariant = 'constellation' | 'data-stream' | 'circuit' | 'neural' | 'aurora';

interface SectionBackgroundProps {
  variant: BackgroundVariant;
}

interface HslColor {
  hOffset: number;
  s: number;
  l: number;
}

// ==================== SHARED HELPERS ====================
const hslToRgb = (h: number, s: number, l: number) => {
  h = ((h % 360) + 360) % 360;
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

function drawGlowDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  r: number,
  g: number,
  b: number,
  alpha: number,
  glowMultiplier: number = 3
) {
  // Outer glow
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * glowMultiplier);
  grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
  grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.1})`);
  grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.beginPath();
  ctx.arc(x, y, radius * glowMultiplier, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Core dot
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  ctx.fill();
}

// ==================== CONSTELLATION (About) ====================
interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: HslColor;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
}

function initDots(w: number, h: number, count: number, colors: HslColor[]): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const color = colors[Math.floor(Math.random() * colors.length)];
    dots.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 1.5 + Math.random() * 2.5,
      baseAlpha: 0.25 + Math.random() * 0.4,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.001 + Math.random() * 0.003,
      color,
      orbitRadius: Math.random() < 0.3 ? 5 + Math.random() * 15 : 0,
      orbitSpeed: 0.001 + Math.random() * 0.003,
      orbitPhase: Math.random() * Math.PI * 2,
    });
  }
  return dots;
}

function drawConstellation(ctx: CanvasRenderingContext2D, w: number, h: number, dots: Dot[], time: number, themeHue: number) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  for (const dot of dots) {
    dot.x += dot.vx;
    dot.y += dot.vy;
    if (dot.x < -20) dot.x = w + 20;
    if (dot.x > w + 20) dot.x = -20;
    if (dot.y < -20) dot.y = h + 20;
    if (dot.y > h + 20) dot.y = -20;

    let drawX = dot.x;
    let drawY = dot.y;
    if (dot.orbitRadius > 0) {
      drawX += Math.sin(time * dot.orbitSpeed + dot.orbitPhase) * dot.orbitRadius;
      drawY += Math.cos(time * dot.orbitSpeed * 0.7 + dot.orbitPhase) * dot.orbitRadius * 0.6;
    }

    const pulse = 1 + 0.4 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * pulse;
    const r = dot.radius * (0.8 + 0.3 * Math.sin(time * dot.pulseSpeed * 1.5 + dot.pulsePhase));

    const rgb = hslToRgb(themeHue + dot.color.hOffset, dot.color.s, dot.color.l);
    drawGlowDot(ctx, drawX, drawY, Math.max(r, 0.5), rgb.r, rgb.g, rgb.b, alpha, 3);
  }
}

// ==================== DATA STREAM (Experience) ====================
interface StreamDot {
  x: number;
  y: number;
  speed: number;
  radius: number;
  baseAlpha: number;
  color: HslColor;
  pulsePhase: number;
  pulseSpeed: number;
  drift: number;
  driftSpeed: number;
  trail: { x: number; y: number }[];
}

function drawDataStream(ctx: CanvasRenderingContext2D, w: number, h: number, dots: StreamDot[], time: number, themeHue: number) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  for (const dot of dots) {
    dot.y += dot.speed;
    dot.x += Math.sin(time * dot.driftSpeed + dot.pulsePhase) * dot.drift;

    if (dot.y > h + 20) {
      dot.y = -20;
      dot.x = Math.random() * w;
      dot.trail = [];
    }

    const rgb = hslToRgb(themeHue + dot.color.hOffset, dot.color.s, dot.color.l);

    dot.trail.push({ x: dot.x, y: dot.y });
    if (dot.trail.length > 5) dot.trail.shift();

    for (let i = 0; i < dot.trail.length; i++) {
      const t = dot.trail[i];
      const trailAlpha = dot.baseAlpha * (i / dot.trail.length) * 0.3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, Math.max(dot.radius * 0.5, 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${trailAlpha})`;
      ctx.fill();
    }

    const pulse = 1 + 0.3 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * pulse;

    drawGlowDot(ctx, dot.x, dot.y, dot.radius, rgb.r, rgb.g, rgb.b, alpha, 4);
  }
}

// ==================== CIRCUIT (Projects) ====================
interface CircuitDot {
  x: number;
  y: number;
  baseRadius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: HslColor;
  ringPhase: number;
  ringSpeed: number;
  ringMaxRadius: number;
}

interface SparkDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: HslColor;
  life: number;
  maxLife: number;
}

function drawCircuit(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dots: CircuitDot[],
  sparks: SparkDot[],
  time: number,
  themeHue: number
) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  for (const dot of dots) {
    const pulse = 1 + 0.4 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * pulse;
    const r = dot.baseRadius * pulse;

    const rgb = hslToRgb(themeHue + dot.color.hOffset, dot.color.s, dot.color.l);
    drawGlowDot(ctx, dot.x, dot.y, Math.max(r, 0.5), rgb.r, rgb.g, rgb.b, alpha, 3);
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i];
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= 0.98;
    spark.vy *= 0.98;
    spark.life--;
    spark.alpha = (spark.life / spark.maxLife) * 0.7;

    if (spark.life <= 0) {
      if (dots.length > 0) {
        const parentDot = dots[Math.floor(Math.random() * dots.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.2;
        spark.x = parentDot.x;
        spark.y = parentDot.y;
        spark.vx = Math.cos(angle) * speed;
        spark.vy = Math.sin(angle) * speed;
        spark.life = 30 + Math.floor(Math.random() * 40);
        spark.maxLife = spark.life;
        spark.color = parentDot.color;
      }
      continue;
    }

    const sparkRgb = hslToRgb(themeHue + spark.color.hOffset, spark.color.s, spark.color.l);
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, Math.max(spark.radius, 0.5), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${sparkRgb.r}, ${sparkRgb.g}, ${sparkRgb.b}, ${spark.alpha})`;
    ctx.fill();
  }
}

// ==================== NEURAL (Skills) ====================
interface NeuralDot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: HslColor;
  oscillateAmplitude: number;
  oscillateSpeedX: number;
  oscillateSpeedY: number;
  orbitDots: OrbitSpark[];
}

interface OrbitSpark {
  angle: number;
  speed: number;
  radius: number;
  distance: number;
  alpha: number;
  color: HslColor;
}

function drawNeural(ctx: CanvasRenderingContext2D, w: number, h: number, dots: NeuralDot[], time: number, themeHue: number) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  for (const dot of dots) {
    dot.x = dot.baseX + Math.sin(time * dot.oscillateSpeedX + dot.pulsePhase) * dot.oscillateAmplitude;
    dot.y = dot.baseY + Math.cos(time * dot.oscillateSpeedY + dot.pulsePhase * 1.3) * dot.oscillateAmplitude * 0.7;

    const pulse = 1 + 0.4 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * pulse;
    const r = dot.radius * (0.8 + 0.3 * Math.sin(time * dot.pulseSpeed * 1.2 + dot.pulsePhase));

    const rgb = hslToRgb(themeHue + dot.color.hOffset, dot.color.s, dot.color.l);
    drawGlowDot(ctx, dot.x, dot.y, Math.max(r, 0.5), rgb.r, rgb.g, rgb.b, alpha, 3);

    for (const orbit of dot.orbitDots) {
      orbit.angle += orbit.speed;
      const ox = dot.x + Math.cos(orbit.angle) * orbit.distance;
      const oy = dot.y + Math.sin(orbit.angle) * orbit.distance;
      const oAlpha = orbit.alpha * pulse;

      const orbitRgb = hslToRgb(themeHue + orbit.color.hOffset, orbit.color.s, orbit.color.l);
      ctx.beginPath();
      ctx.arc(ox, oy, Math.max(orbit.radius, 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${orbitRgb.r}, ${orbitRgb.g}, ${orbitRgb.b}, ${oAlpha})`;
      ctx.fill();
    }
  }
}

// ==================== AURORA (Contact) ====================
interface AuroraDot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  breathSpeed: number;
  breathPhase: number;
  color: HslColor;
  driftSpeedX: number;
  driftSpeedY: number;
  sizeOscSpeed: number;
  sizeOscPhase: number;
}

function drawAurora(ctx: CanvasRenderingContext2D, w: number, h: number, dots: AuroraDot[], time: number, themeHue: number) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  for (const dot of dots) {
    dot.x = dot.baseX + Math.sin(time * dot.driftSpeedX + dot.pulsePhase) * 20;
    dot.y = dot.baseY + Math.cos(time * dot.driftSpeedY + dot.pulsePhase * 1.2) * 15;

    const breath = 0.5 + 0.5 * Math.sin(time * dot.breathSpeed + dot.breathPhase);
    const pulse = 1 + 0.3 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * breath * pulse;

    const sizeOsc = 1 + 0.2 * Math.sin(time * dot.sizeOscSpeed + dot.sizeOscPhase);
    const r = dot.radius * sizeOsc;

    const rgb = hslToRgb(themeHue + dot.color.hOffset, dot.color.s, dot.color.l);
    drawGlowDot(ctx, dot.x, dot.y, Math.max(r, 0.5), rgb.r, rgb.g, rgb.b, alpha, 4);
  }
}

// ==================== MAIN COMPONENT ====================

export default function SectionBackground({ variant }: SectionBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const cachedHueRef = useRef<number>(200);
  const isVisibleRef = useRef<boolean>(true);

  // Gradient overlay caches
  const vignetteGradRef = useRef<CanvasGradient | null>(null);
  const topFadeRef = useRef<CanvasGradient | null>(null);
  const bottomFadeRef = useRef<CanvasGradient | null>(null);

  // Particle state refs
  const constellationDotsRef = useRef<Dot[]>([]);
  const dataStreamDotsRef = useRef<StreamDot[]>([]);
  const circuitDotsRef = useRef<CircuitDot[]>([]);
  const circuitSparksRef = useRef<SparkDot[]>([]);
  const neuralDotsRef = useRef<NeuralDot[]>([]);
  const auroraDotsRef = useRef<AuroraDot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // IntersectionObserver to pause animation when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const updateGradients = (cw: number, ch: number) => {
      const vignetteGrad = ctx.createRadialGradient(
        cw / 2, ch / 2, Math.min(cw, ch) * 0.3,
        cw / 2, ch / 2, Math.max(cw, ch) * 0.7
      );
      vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      vignetteGradRef.current = vignetteGrad;

      const topFade = ctx.createLinearGradient(0, 0, 0, ch * 0.12);
      topFade.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      topFade.addColorStop(1, 'rgba(0, 0, 0, 0)');
      topFadeRef.current = topFade;

      const bottomFade = ctx.createLinearGradient(0, ch * 0.88, 0, ch);
      bottomFade.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bottomFade.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      bottomFadeRef.current = bottomFade;
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        updateGradients(rect.width, rect.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const cw = canvas.width;
    const ch = canvas.height;

    // Initialize particles (slightly reduced count for 60fps smoothness)
    if (variant === 'constellation' && constellationDotsRef.current.length === 0) {
      const colors: HslColor[] = [
        { hOffset: 60, s: 90, l: 74 },
        { hOffset: 60, s: 84, l: 67 },
        { hOffset: 0, s: 93, l: 60 },
      ];
      const count = Math.max(Math.floor((cw * ch) / 12000), 25);
      constellationDotsRef.current = initDots(cw, ch, count, colors);
    }

    if (variant === 'data-stream' && dataStreamDotsRef.current.length === 0) {
      const colors: HslColor[] = [
        { hOffset: 15, s: 94, l: 43 },
        { hOffset: -20, s: 91, l: 60 },
        { hOffset: 0, s: 93, l: 60 },
      ];
      const count = Math.max(Math.floor(cw / 35), 20);
      const dots: StreamDot[] = [];
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * cw,
          y: Math.random() * ch,
          speed: 0.3 + Math.random() * 0.7,
          radius: 1.5 + Math.random() * 2.5,
          baseAlpha: 0.2 + Math.random() * 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.001 + Math.random() * 0.003,
          drift: 0.3 + Math.random() * 0.4,
          driftSpeed: 0.0005 + Math.random() * 0.001,
          trail: [],
        });
      }
      dataStreamDotsRef.current = dots;
    }

    if (variant === 'circuit' && circuitDotsRef.current.length === 0) {
      const colors: HslColor[] = [
        { hOffset: 15, s: 94, l: 43 },
        { hOffset: -20, s: 91, l: 60 },
        { hOffset: 0, s: 93, l: 60 },
      ];
      const cols = Math.floor(cw / 80);
      const rows = Math.floor(ch / 80);
      const dots: CircuitDot[] = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (Math.random() < 0.3) continue;
          dots.push({
            x: col * 80 + 40 + (Math.random() - 0.5) * 20,
            y: row * 80 + 40 + (Math.random() - 0.5) * 20,
            baseRadius: 2 + Math.random() * 2.5,
            baseAlpha: 0.2 + Math.random() * 0.35,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.001 + Math.random() * 0.003,
            color: colors[Math.floor(Math.random() * colors.length)],
            ringPhase: Math.random(),
            ringSpeed: 0.0005 + Math.random() * 0.001,
            ringMaxRadius: 15 + Math.random() * 20,
          });
        }
      }
      circuitDotsRef.current = dots;

      const sparks: SparkDot[] = [];
      for (let i = 0; i < Math.min(8, dots.length / 2); i++) {
        const parent = dots[Math.floor(Math.random() * dots.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.2;
        sparks.push({
          x: parent.x,
          y: parent.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1 + Math.random() * 1.2,
          alpha: 0.6,
          color: parent.color,
          life: 30 + Math.floor(Math.random() * 40),
          maxLife: 70,
        });
      }
      circuitSparksRef.current = sparks;
    }

    if (variant === 'neural' && neuralDotsRef.current.length === 0) {
      const colors: HslColor[] = [
        { hOffset: 0, s: 93, l: 60 },
        { hOffset: 60, s: 90, l: 74 },
        { hOffset: -20, s: 91, l: 60 },
      ];
      const layers = 4;
      const nodesPerLayer = Math.floor(ch / 100);
      const dots: NeuralDot[] = [];

      for (let l = 0; l < layers; l++) {
        const count = Math.max(nodesPerLayer - Math.abs(l - Math.floor(layers / 2)) * 2, 2);
        for (let n = 0; n < count; n++) {
          const baseX = (cw / (layers + 1)) * (l + 1);
          const baseY = (ch / (count + 1)) * (n + 1);
          const color = colors[Math.floor(Math.random() * colors.length)];

          const orbitDots: OrbitSpark[] = [];
          for (let o = 0; o < 2; o++) {
            orbitDots.push({
              angle: Math.random() * Math.PI * 2,
              speed: 0.01 + Math.random() * 0.02,
              radius: 0.8 + Math.random() * 1.0,
              distance: 8 + Math.random() * 15,
              alpha: 0.3 + Math.random() * 0.3,
              color: { hOffset: color.hOffset, s: color.s, l: Math.min(color.l + 10, 100) },
            });
          }

          dots.push({
            x: baseX, y: baseY,
            baseX, baseY,
            radius: 2.5 + Math.random() * 3,
            baseAlpha: 0.2 + Math.random() * 0.35,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.001 + Math.random() * 0.003,
            color,
            oscillateAmplitude: 5 + Math.random() * 10,
            oscillateSpeedX: 0.0003 + Math.random() * 0.0007,
            oscillateSpeedY: 0.0004 + Math.random() * 0.0006,
            orbitDots,
          });
        }
      }
      neuralDotsRef.current = dots;
    }

    if (variant === 'aurora' && auroraDotsRef.current.length === 0) {
      const colors: HslColor[] = [
        { hOffset: -20, s: 91, l: 60 },
        { hOffset: 60, s: 90, l: 74 },
        { hOffset: 0, s: 93, l: 60 },
      ];
      const count = Math.max(Math.floor((cw * ch) / 10000), 30);
      const dots: AuroraDot[] = [];
      for (let i = 0; i < count; i++) {
        const baseX = Math.random() * cw;
        const baseY = Math.random() * ch;
        dots.push({
          x: baseX, y: baseY,
          baseX, baseY,
          radius: 1.5 + Math.random() * 3.5,
          baseAlpha: 0.15 + Math.random() * 0.35,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.001 + Math.random() * 0.002,
          breathSpeed: 0.0005 + Math.random() * 0.001,
          breathPhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          driftSpeedX: 0.0002 + Math.random() * 0.0004,
          driftSpeedY: 0.0001 + Math.random() * 0.0003,
          sizeOscSpeed: 0.001 + Math.random() * 0.002,
          sizeOscPhase: Math.random() * Math.PI * 2,
        });
      }
      auroraDotsRef.current = dots;
    }

    // Main 60 FPS animation loop with delta-time throttling
    const animate = (timestamp: number) => {
      animationRef.current = requestAnimationFrame(animate);

      // Skip rendering if off-screen
      if (!isVisibleRef.current) return;

      // Throttle to 60 FPS (~16.6ms)
      if (timestamp - lastTimeRef.current < 16) return;
      lastTimeRef.current = timestamp;

      timeRef.current += 1;
      const t = timeRef.current;

      // Poll theme hue once every 30 frames
      if (t % 30 === 0 && typeof window !== 'undefined') {
        const val = getComputedStyle(document.documentElement).getPropertyValue('--theme-hue');
        if (val) cachedHueRef.current = parseInt(val.trim(), 10) || 200;
      }
      const themeHue = cachedHueRef.current;

      const w = canvas.width;
      const h = canvas.height;

      switch (variant) {
        case 'constellation':
          drawConstellation(ctx, w, h, constellationDotsRef.current, t, themeHue);
          break;
        case 'data-stream':
          drawDataStream(ctx, w, h, dataStreamDotsRef.current, t, themeHue);
          break;
        case 'circuit':
          drawCircuit(ctx, w, h, circuitDotsRef.current, circuitSparksRef.current, t, themeHue);
          break;
        case 'neural':
          drawNeural(ctx, w, h, neuralDotsRef.current, t, themeHue);
          break;
        case 'aurora':
          drawAurora(ctx, w, h, auroraDotsRef.current, t, themeHue);
          break;
      }

      // Pre-cached vignette and fade overlays
      if (vignetteGradRef.current) {
        ctx.fillStyle = vignetteGradRef.current;
        ctx.fillRect(0, 0, w, h);
      }
      if (topFadeRef.current) {
        ctx.fillStyle = topFadeRef.current;
        ctx.fillRect(0, 0, w, h * 0.12);
      }
      if (bottomFadeRef.current) {
        ctx.fillStyle = bottomFadeRef.current;
        ctx.fillRect(0, h * 0.88, w, h * 0.12);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ pointerEvents: 'none', willChange: 'transform', transform: 'translateZ(0)' }}
      aria-hidden="true"
    />
  );
}
