'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated Section Backgrounds — Dots Only, No Lines
 * Each section has uniquely animated dot particles:
 *
 * 1. "constellation" — About: Floating wandering dots with proximity glow
 * 2. "data-stream" — Experience: Falling/rising dot particles with trails
 * 3. "circuit" — Projects: Grid-aligned pulsing dots with random energy sparks
 * 4. "neural" — Skills: Layered oscillating dots with orbiting sparks
 * 5. "aurora" — Contact: Drifting luminous dots with breath-sync
 */

export type BackgroundVariant = 'constellation' | 'data-stream' | 'circuit' | 'neural' | 'aurora';

interface SectionBackgroundProps {
  variant: BackgroundVariant;
}

// ==================== SHARED HELPERS ====================
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 100, b: 255 };
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
  glowMultiplier: number = 4
) {
  // Outer glow
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * glowMultiplier);
  grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`);
  grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);
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

  // Bright center
  if (radius > 1.5) {
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.min(r + 80, 255)}, ${Math.min(g + 80, 255)}, ${Math.min(b + 60, 255)}, ${alpha * 0.8})`;
    ctx.fill();
  }
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
  color: { r: number; g: number; b: number };
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  baseX: number;
  baseY: number;
}

function initDots(w: number, h: number, count: number, colors: { r: number; g: number; b: number }[]): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const color = colors[Math.floor(Math.random() * colors.length)];
    dots.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 1.5 + Math.random() * 3,
      baseAlpha: 0.25 + Math.random() * 0.5,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.001 + Math.random() * 0.003,
      color,
      orbitRadius: Math.random() < 0.3 ? 5 + Math.random() * 20 : 0,
      orbitSpeed: 0.001 + Math.random() * 0.003,
      orbitPhase: Math.random() * Math.PI * 2,
      baseX: x,
      baseY: y,
    });
  }
  return dots;
}

function drawConstellation(canvas: HTMLCanvasElement, dots: Dot[], time: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  for (const dot of dots) {
    // Move freely
    dot.x += dot.vx;
    dot.y += dot.vy;
    if (dot.x < -20) dot.x = w + 20;
    if (dot.x > w + 20) dot.x = -20;
    if (dot.y < -20) dot.y = h + 20;
    if (dot.y > h + 20) dot.y = -20;

    // Add orbit wobble for some dots
    let drawX = dot.x;
    let drawY = dot.y;
    if (dot.orbitRadius > 0) {
      drawX += Math.sin(time * dot.orbitSpeed + dot.orbitPhase) * dot.orbitRadius;
      drawY += Math.cos(time * dot.orbitSpeed * 0.7 + dot.orbitPhase) * dot.orbitRadius * 0.6;
    }

    // Animated pulse
    const pulse = 1 + 0.5 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * pulse;
    const r = dot.radius * (0.8 + 0.4 * Math.sin(time * dot.pulseSpeed * 1.5 + dot.pulsePhase));

    // Proximity glow — brighter when near other dots
    let proximityBoost = 0;
    for (const other of dots) {
      if (other === dot) continue;
      const dx = drawX - other.x;
      const dy = drawY - other.y;
      const dist = dx * dx + dy * dy;
      if (dist < 22500) { // 150px squared
        proximityBoost += (1 - Math.sqrt(dist) / 150) * 0.15;
      }
    }

    drawGlowDot(
      ctx, drawX, drawY,
      Math.max(r, 0.5),
      dot.color.r, dot.color.g, dot.color.b,
      Math.min(alpha + proximityBoost, 1),
      4
    );
  }
}

// ==================== DATA STREAM (Experience) ====================
interface StreamDot {
  x: number;
  y: number;
  speed: number;
  radius: number;
  baseAlpha: number;
  color: { r: number; g: number; b: number };
  pulsePhase: number;
  pulseSpeed: number;
  drift: number;
  driftSpeed: number;
  trail: { x: number; y: number; alpha: number }[];
}

function drawDataStream(canvas: HTMLCanvasElement, dots: StreamDot[], time: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  for (const dot of dots) {
    // Fall downward
    dot.y += dot.speed;
    dot.x += Math.sin(time * dot.driftSpeed + dot.pulsePhase) * dot.drift;

    if (dot.y > h + 20) {
      dot.y = -20;
      dot.x = Math.random() * w;
      dot.trail = [];
    }

    // Update trail
    dot.trail.push({ x: dot.x, y: dot.y, alpha: dot.baseAlpha * 0.4 });
    if (dot.trail.length > 8) dot.trail.shift();

    // Draw trail (fading dots, no lines)
    for (let i = 0; i < dot.trail.length; i++) {
      const t = dot.trail[i];
      const trailAlpha = t.alpha * (i / dot.trail.length) * 0.5;
      const trailR = dot.radius * (0.3 + 0.7 * (i / dot.trail.length));
      ctx.beginPath();
      ctx.arc(t.x, t.y, Math.max(trailR, 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${trailAlpha})`;
      ctx.fill();
    }

    // Animated pulse
    const pulse = 1 + 0.4 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * pulse;

    drawGlowDot(ctx, dot.x, dot.y, dot.radius, dot.color.r, dot.color.g, dot.color.b, alpha, 5);
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
  color: { r: number; g: number; b: number };
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
  color: { r: number; g: number; b: number };
  life: number;
  maxLife: number;
}

function drawCircuit(
  canvas: HTMLCanvasElement,
  dots: CircuitDot[],
  sparks: SparkDot[],
  time: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  // Draw static dots with expanding ring animation
  for (const dot of dots) {
    const pulse = 1 + 0.5 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * pulse;
    const r = dot.baseRadius * pulse;

    drawGlowDot(ctx, dot.x, dot.y, Math.max(r, 0.5), dot.color.r, dot.color.g, dot.color.b, alpha, 4);

    // Expanding ripple dots (instead of ring stroke)
    const ringProgress = ((time * dot.ringSpeed + dot.ringPhase) % 1);
    const ringRadius = dot.baseRadius + ringProgress * dot.ringMaxRadius;
    const ringAlpha = (1 - ringProgress) * 0.2;
    const rippleDotCount = 8;
    for (let d = 0; d < rippleDotCount; d++) {
      const angle = (d / rippleDotCount) * Math.PI * 2 + time * 0.001;
      const rx = dot.x + Math.cos(angle) * ringRadius;
      const ry = dot.y + Math.sin(angle) * ringRadius;
      ctx.beginPath();
      ctx.arc(rx, ry, Math.max(0.8, 0.8), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${ringAlpha})`;
      ctx.fill();
    }
  }

  // Update & draw sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i];
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= 0.98;
    spark.vy *= 0.98;
    spark.life--;
    spark.alpha = (spark.life / spark.maxLife) * 0.8;

    if (spark.life <= 0) {
      // Respawn from a random dot
      const parentDot = dots[Math.floor(Math.random() * dots.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      spark.x = parentDot.x;
      spark.y = parentDot.y;
      spark.vx = Math.cos(angle) * speed;
      spark.vy = Math.sin(angle) * speed;
      spark.life = 40 + Math.floor(Math.random() * 60);
      spark.maxLife = spark.life;
      spark.color = parentDot.color;
      continue;
    }

    drawGlowDot(ctx, spark.x, spark.y, Math.max(spark.radius, 0.3), spark.color.r, spark.color.g, spark.color.b, spark.alpha, 3);
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
  color: { r: number; g: number; b: number };
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
  color: { r: number; g: number; b: number };
}

function drawNeural(canvas: HTMLCanvasElement, dots: NeuralDot[], time: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  for (const dot of dots) {
    // Oscillate position
    dot.x = dot.baseX + Math.sin(time * dot.oscillateSpeedX + dot.pulsePhase) * dot.oscillateAmplitude;
    dot.y = dot.baseY + Math.cos(time * dot.oscillateSpeedY + dot.pulsePhase * 1.3) * dot.oscillateAmplitude * 0.7;

    const pulse = 1 + 0.6 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * pulse;
    const r = dot.radius * (0.7 + 0.5 * Math.sin(time * dot.pulseSpeed * 1.2 + dot.pulsePhase));

    drawGlowDot(ctx, dot.x, dot.y, Math.max(r, 0.5), dot.color.r, dot.color.g, dot.color.b, alpha, 4);

    // Draw orbiting sparks
    for (const orbit of dot.orbitDots) {
      orbit.angle += orbit.speed;
      const ox = dot.x + Math.cos(orbit.angle) * orbit.distance;
      const oy = dot.y + Math.sin(orbit.angle) * orbit.distance;
      const oAlpha = orbit.alpha * pulse;

      ctx.beginPath();
      ctx.arc(ox, oy, Math.max(orbit.radius, 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${orbit.color.r}, ${orbit.color.g}, ${orbit.color.b}, ${oAlpha})`;
      ctx.fill();

      // Tiny glow
      const oGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orbit.radius * 4);
      oGrad.addColorStop(0, `rgba(${orbit.color.r}, ${orbit.color.g}, ${orbit.color.b}, ${oAlpha * 0.3})`);
      oGrad.addColorStop(1, `rgba(${orbit.color.r}, ${orbit.color.g}, ${orbit.color.b}, 0)`);
      ctx.beginPath();
      ctx.arc(ox, oy, orbit.radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = oGrad;
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
  color: { r: number; g: number; b: number };
  driftSpeedX: number;
  driftSpeedY: number;
  sizeOscSpeed: number;
  sizeOscPhase: number;
}

function drawAurora(canvas: HTMLCanvasElement, dots: AuroraDot[], time: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  // Subtle ambient gradient glow (no lines)
  ctx.globalCompositeOperation = 'screen';
  const ambientGrad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.5);
  ambientGrad.addColorStop(0, 'rgba(129, 140, 248, 0.03)');
  ambientGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.015)');
  ambientGrad.addColorStop(1, 'rgba(10, 10, 26, 0)');
  ctx.fillStyle = ambientGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';

  for (const dot of dots) {
    // Gentle drift
    dot.x = dot.baseX + Math.sin(time * dot.driftSpeedX + dot.pulsePhase) * 30
                     + Math.sin(time * dot.driftSpeedX * 0.3 + dot.breathPhase) * 15;
    dot.y = dot.baseY + Math.cos(time * dot.driftSpeedY + dot.pulsePhase * 1.2) * 20
                     + Math.cos(time * dot.driftSpeedY * 0.5 + dot.breathPhase) * 10;

    // Breath-sync alpha
    const breath = 0.5 + 0.5 * Math.sin(time * dot.breathSpeed + dot.breathPhase);
    const pulse = 1 + 0.4 * Math.sin(time * dot.pulseSpeed + dot.pulsePhase);
    const alpha = dot.baseAlpha * breath * pulse;

    // Size oscillation
    const sizeOsc = 1 + 0.3 * Math.sin(time * dot.sizeOscSpeed + dot.sizeOscPhase);
    const r = dot.radius * sizeOsc;

    drawGlowDot(ctx, dot.x, dot.y, Math.max(r, 0.5), dot.color.r, dot.color.g, dot.color.b, alpha, 5);
  }
}

// ==================== MAIN COMPONENT ====================

export default function SectionBackground({ variant }: SectionBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const initRef = useRef(false);

  // State refs
  const constellationDotsRef = useRef<Dot[]>([]);
  const dataStreamDotsRef = useRef<StreamDot[]>([]);
  const circuitDotsRef = useRef<CircuitDot[]>([]);
  const circuitSparksRef = useRef<SparkDot[]>([]);
  const neuralDotsRef = useRef<NeuralDot[]>([]);
  const auroraDotsRef = useRef<AuroraDot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.width;
    const h = () => canvas.height;

    if (!initRef.current) {
      initRef.current = true;

      // ===== CONSTELLATION =====
      if (variant === 'constellation') {
        const colors = [
          { r: 129, g: 140, b: 248 }, // indigo
          { r: 99, g: 102, b: 241 },  // violet
          { r: 165, g: 180, b: 252 }, // light indigo
          { r: 56, g: 189, b: 248 },  // sky
        ];
        const count = Math.max(Math.floor((w() * h()) / 8000), 40);
        constellationDotsRef.current = initDots(w(), h(), count, colors);
      }

      // ===== DATA STREAM =====
      if (variant === 'data-stream') {
        const colors = [
          { r: 6, g: 182, b: 212 },   // cyan
          { r: 59, g: 130, b: 246 },  // blue
          { r: 129, g: 140, b: 248 }, // indigo
          { r: 56, g: 189, b: 248 },  // sky
        ];
        const count = Math.max(Math.floor(w() / 25), 30);
        const dots: StreamDot[] = [];
        for (let i = 0; i < count; i++) {
          dots.push({
            x: Math.random() * w(),
            y: Math.random() * h(),
            speed: 0.2 + Math.random() * 0.8,
            radius: 1.5 + Math.random() * 3,
            baseAlpha: 0.2 + Math.random() * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.001 + Math.random() * 0.003,
            drift: 0.3 + Math.random() * 0.5,
            driftSpeed: 0.0005 + Math.random() * 0.001,
            trail: [],
          });
        }
        dataStreamDotsRef.current = dots;
      }

      // ===== CIRCUIT =====
      if (variant === 'circuit') {
        const colors = [
          { r: 6, g: 182, b: 212 },   // cyan
          { r: 59, g: 130, b: 246 },  // blue
          { r: 56, g: 189, b: 248 },  // sky
          { r: 129, g: 140, b: 248 }, // indigo
        ];
        const cols = Math.floor(w() / 70);
        const rows = Math.floor(h() / 70);
        const dots: CircuitDot[] = [];

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            if (Math.random() < 0.25) continue; // skip some
            const jx = (Math.random() - 0.5) * 25;
            const jy = (Math.random() - 0.5) * 25;
            dots.push({
              x: col * 70 + 35 + jx,
              y: row * 70 + 35 + jy,
              baseRadius: 2 + Math.random() * 3,
              baseAlpha: 0.2 + Math.random() * 0.4,
              pulsePhase: Math.random() * Math.PI * 2,
              pulseSpeed: 0.001 + Math.random() * 0.003,
              color: colors[Math.floor(Math.random() * colors.length)],
              ringPhase: Math.random(),
              ringSpeed: 0.0005 + Math.random() * 0.001,
              ringMaxRadius: 15 + Math.random() * 25,
            });
          }
        }
        circuitDotsRef.current = dots;

        // Init sparks
        const sparks: SparkDot[] = [];
        for (let i = 0; i < Math.min(15, dots.length / 2); i++) {
          const parent = dots[Math.floor(Math.random() * dots.length)];
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 1.5;
          sparks.push({
            x: parent.x,
            y: parent.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 1 + Math.random() * 1.5,
            alpha: 0.6,
            color: parent.color,
            life: 40 + Math.floor(Math.random() * 60),
            maxLife: 100,
          });
        }
        circuitSparksRef.current = sparks;
      }

      // ===== NEURAL =====
      if (variant === 'neural') {
        const colors = [
          { r: 56, g: 189, b: 248 },  // sky
          { r: 129, g: 140, b: 248 }, // indigo
          { r: 99, g: 102, b: 241 },  // violet
          { r: 59, g: 130, b: 246 },  // blue
        ];
        const layers = 5;
        const nodesPerLayer = Math.floor(h() / 90);
        const dots: NeuralDot[] = [];

        for (let l = 0; l < layers; l++) {
          const count = Math.max(nodesPerLayer - Math.abs(l - Math.floor(layers / 2)) * 2, 3);
          for (let n = 0; n < count; n++) {
            const baseX = (w() / (layers + 1)) * (l + 1);
            const baseY = (h() / (count + 1)) * (n + 1);
            const color = colors[Math.floor(Math.random() * colors.length)];

            // Create 1-3 orbiting sparks
            const orbitDots: OrbitSpark[] = [];
            const numOrbits = 1 + Math.floor(Math.random() * 3);
            for (let o = 0; o < numOrbits; o++) {
              orbitDots.push({
                angle: Math.random() * Math.PI * 2,
                speed: 0.01 + Math.random() * 0.03,
                radius: 0.8 + Math.random() * 1.2,
                distance: 8 + Math.random() * 18,
                alpha: 0.3 + Math.random() * 0.4,
                color: {
                  r: Math.min(color.r + 40, 255),
                  g: Math.min(color.g + 40, 255),
                  b: Math.min(color.b + 30, 255),
                },
              });
            }

            dots.push({
              x: baseX, y: baseY,
              baseX, baseY,
              radius: 3 + Math.random() * 4,
              baseAlpha: 0.2 + Math.random() * 0.4,
              pulsePhase: Math.random() * Math.PI * 2,
              pulseSpeed: 0.001 + Math.random() * 0.003,
              color,
              oscillateAmplitude: 5 + Math.random() * 12,
              oscillateSpeedX: 0.0003 + Math.random() * 0.0008,
              oscillateSpeedY: 0.0004 + Math.random() * 0.0006,
              orbitDots,
            });
          }
        }
        neuralDotsRef.current = dots;
      }

      // ===== AURORA =====
      if (variant === 'aurora') {
        const colors = [
          { r: 59, g: 130, b: 246 },  // blue
          { r: 129, g: 140, b: 248 }, // indigo
          { r: 56, g: 189, b: 248 },  // sky
          { r: 6, g: 182, b: 212 },   // cyan
          { r: 99, g: 102, b: 241 },  // violet
          { r: 165, g: 180, b: 252 }, // light indigo
        ];
        const count = Math.max(Math.floor((w() * h()) / 6000), 50);
        const dots: AuroraDot[] = [];
        for (let i = 0; i < count; i++) {
          const baseX = Math.random() * w();
          const baseY = Math.random() * h();
          dots.push({
            x: baseX, y: baseY,
            baseX, baseY,
            radius: 1.5 + Math.random() * 4,
            baseAlpha: 0.15 + Math.random() * 0.45,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.001 + Math.random() * 0.002,
            breathSpeed: 0.0005 + Math.random() * 0.001,
            breathPhase: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            driftSpeedX: 0.0002 + Math.random() * 0.0005,
            driftSpeedY: 0.0001 + Math.random() * 0.0003,
            sizeOscSpeed: 0.001 + Math.random() * 0.003,
            sizeOscPhase: Math.random() * Math.PI * 2,
          });
        }
        auroraDotsRef.current = dots;
      }
    }

    const animate = () => {
      timeRef.current += 1;
      const t = timeRef.current;

      switch (variant) {
        case 'constellation':
          drawConstellation(canvas, constellationDotsRef.current, t);
          break;
        case 'data-stream':
          drawDataStream(canvas, dataStreamDotsRef.current, t);
          break;
        case 'circuit':
          drawCircuit(canvas, circuitDotsRef.current, circuitSparksRef.current, t);
          break;
        case 'neural':
          drawNeural(canvas, neuralDotsRef.current, t);
          break;
        case 'aurora':
          drawAurora(canvas, auroraDotsRef.current, t);
          break;
      }

      // Vignette
      const cw = canvas.width;
      const ch = canvas.height;
      const vignetteGrad = ctx.createRadialGradient(
        cw / 2, ch / 2, Math.min(cw, ch) * 0.3,
        cw / 2, ch / 2, Math.max(cw, ch) * 0.7
      );
      vignetteGrad.addColorStop(0, 'rgba(10, 10, 26, 0)');
      vignetteGrad.addColorStop(1, 'rgba(10, 10, 26, 0.4)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Top/bottom fade
      const topFade = ctx.createLinearGradient(0, 0, 0, ch * 0.12);
      topFade.addColorStop(0, 'rgba(10, 10, 26, 0.8)');
      topFade.addColorStop(1, 'rgba(10, 10, 26, 0)');
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, cw, ch * 0.12);

      const bottomFade = ctx.createLinearGradient(0, ch * 0.88, 0, ch);
      bottomFade.addColorStop(0, 'rgba(10, 10, 26, 0)');
      bottomFade.addColorStop(1, 'rgba(10, 10, 26, 0.8)');
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, ch * 0.88, cw, ch * 0.12);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
