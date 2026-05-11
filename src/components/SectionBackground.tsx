'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated Section Backgrounds
 * Each section gets a unique, mesmerizing canvas animation:
 *
 * 1. "constellation" — About: Floating connected dots forming a constellation network
 * 2. "data-stream" — Experience: Flowing vertical light streams with pulses
 * 3. "circuit" — Projects: Electric circuit-board with traveling pulses
 * 4. "neural" — Skills: Neural network nodes with pulsing connections
 * 5. "aurora" — Contact: Aurora borealis flowing waves
 */

export type BackgroundVariant = 'constellation' | 'data-stream' | 'circuit' | 'neural' | 'aurora';

interface SectionBackgroundProps {
  variant: BackgroundVariant;
}

// ==================== CONSTELLATION (About) ====================
interface ConstellationNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

function drawConstellation(canvas: HTMLCanvasElement, nodes: ConstellationNode[], time: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  // Clear with dark base
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  // Move nodes
  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > w) node.vx *= -1;
    if (node.y < 0 || node.y > h) node.vy *= -1;
    node.x = Math.max(0, Math.min(w, node.x));
    node.y = Math.max(0, Math.min(h, node.y));
  }

  // Draw connections
  const maxDist = 150;
  ctx.lineWidth = 0.5;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.15;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  for (const node of nodes) {
    const pulse = 1 + 0.3 * Math.sin(time * node.pulseSpeed + node.pulsePhase);
    const alpha = node.baseAlpha * pulse;

    // Glow
    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4);
    grad.addColorStop(0, `rgba(129, 140, 248, ${alpha * 0.4})`);
    grad.addColorStop(1, 'rgba(129, 140, 248, 0)');
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(129, 140, 248, ${alpha})`;
    ctx.fill();
  }

  // Subtle wave line across
  ctx.globalCompositeOperation = 'screen';
  for (let wv = 0; wv < 2; wv++) {
    ctx.beginPath();
    const waveY = h * (0.35 + wv * 0.3);
    for (let x = 0; x <= w; x += 3) {
      const y = waveY + Math.sin(x * 0.005 + time * 0.0008 + wv) * 20
                      + Math.sin(x * 0.01 + time * 0.0015) * 10;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(129, 140, 248, 0.04)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
}

// ==================== DATA STREAM (Experience) ====================
interface DataStream {
  x: number;
  y: number;
  speed: number;
  length: number;
  alpha: number;
  width: number;
  color: { r: number; g: number; b: number };
  pulsePhase: number;
  pulseInterval: number;
  nextPulse: number;
}

interface DataPulse {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
  color: { r: number; g: number; b: number };
  life: number;
}

function drawDataStream(
  canvas: HTMLCanvasElement,
  streams: DataStream[],
  pulses: DataPulse[],
  time: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  // Update & draw streams
  for (const stream of streams) {
    stream.y += stream.speed;
    if (stream.y - stream.length > h) {
      stream.y = -stream.length;
      stream.x = Math.random() * w;
    }

    // Gradient stream line
    const grad = ctx.createLinearGradient(stream.x, stream.y - stream.length, stream.x, stream.y);
    grad.addColorStop(0, `rgba(${stream.color.r}, ${stream.color.g}, ${stream.color.b}, 0)`);
    grad.addColorStop(0.5, `rgba(${stream.color.r}, ${stream.color.g}, ${stream.color.b}, ${stream.alpha})`);
    grad.addColorStop(1, `rgba(${stream.color.r}, ${stream.color.g}, ${stream.color.b}, 0)`);

    ctx.beginPath();
    ctx.moveTo(stream.x, stream.y - stream.length);
    ctx.lineTo(stream.x, stream.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = stream.width;
    ctx.stroke();

    // Spawn pulse
    if (time > stream.nextPulse) {
      pulses.push({
        x: stream.x,
        y: stream.y,
        speed: stream.speed * 2,
        size: 3,
        alpha: 0.8,
        color: stream.color,
        life: 60,
      });
      stream.nextPulse = time + stream.pulseInterval + Math.random() * 3000;
    }
  }

  // Update & draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    const pulse = pulses[i];
    pulse.y += pulse.speed;
    pulse.life--;
    pulse.alpha *= 0.97;

    if (pulse.life <= 0 || pulse.y > h) {
      pulses.splice(i, 1);
      continue;
    }

    const grad = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, pulse.size * 6);
    grad.addColorStop(0, `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, ${pulse.alpha})`);
    grad.addColorStop(0.4, `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, ${pulse.alpha * 0.3})`);
    grad.addColorStop(1, `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, 0)`);

    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, pulse.size * 6, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, pulse.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.min(pulse.color.r + 60, 255)}, ${Math.min(pulse.color.g + 60, 255)}, ${Math.min(pulse.color.b + 40, 255)}, ${pulse.alpha})`;
    ctx.fill();
  }

  // Horizontal data flow lines
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 3; i++) {
    const lineY = h * (0.25 + i * 0.25);
    const offset = time * 0.0005 * (i % 2 === 0 ? 1 : -1);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = lineY + Math.sin(x * 0.008 + offset + i * 2) * 8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(6, 182, 212, 0.03)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
}

// ==================== CIRCUIT (Projects) ====================
interface CircuitNode {
  x: number;
  y: number;
  connections: number[];
  pulsePhase: number;
  pulseSpeed: number;
  glowAlpha: number;
}

interface CircuitPulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: { r: number; g: number; b: number };
  size: number;
}

function drawCircuit(
  canvas: HTMLCanvasElement,
  circuitNodes: CircuitNode[],
  circuitPulses: CircuitPulse[],
  time: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  // Draw connections (lines between nodes)
  const drawnPairs = new Set<string>();
  for (let i = 0; i < circuitNodes.length; i++) {
    const node = circuitNodes[i];
    for (const j of node.connections) {
      const pairKey = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (drawnPairs.has(pairKey)) continue;
      drawnPairs.add(pairKey);

      const other = circuitNodes[j];
      if (!other) continue;

      ctx.beginPath();
      // Draw L-shaped connections (circuit board style)
      const midX = other.x;
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(midX, node.y);
      ctx.lineTo(midX, other.y);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Small dot at corner
      ctx.beginPath();
      ctx.arc(midX, node.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.fill();
    }
  }

  // Draw & update pulses
  for (let i = circuitPulses.length - 1; i >= 0; i--) {
    const pulse = circuitPulses[i];
    pulse.progress += pulse.speed;
    if (pulse.progress >= 1) {
      // Restart with new random path
      const fromIdx = Math.floor(Math.random() * circuitNodes.length);
      const from = circuitNodes[fromIdx];
      if (from.connections.length > 0) {
        const toIdx = from.connections[Math.floor(Math.random() * from.connections.length)];
        pulse.fromNode = fromIdx;
        pulse.toNode = toIdx;
        pulse.progress = 0;
        const colors = [
          { r: 6, g: 182, b: 212 },
          { r: 59, b: 246, g: 130 },
          { r: 56, g: 189, b: 248 },
        ];
        pulse.color = colors[Math.floor(Math.random() * colors.length)];
      } else {
        circuitPulses.splice(i, 1);
      }
      continue;
    }

    const from = circuitNodes[pulse.fromNode];
    const to = circuitNodes[pulse.toNode];
    if (!from || !to) continue;

    // Interpolate position along L-path
    let px: number, py: number;
    if (pulse.progress < 0.5) {
      // First segment: from → corner
      const t = pulse.progress * 2;
      px = from.x + (to.x - from.x) * t;
      py = from.y;
    } else {
      // Second segment: corner → to
      const t = (pulse.progress - 0.5) * 2;
      px = to.x;
      py = from.y + (to.y - from.y) * t;
    }

    const pulseAlpha = Math.sin(pulse.progress * Math.PI) * 0.9;

    const grad = ctx.createRadialGradient(px, py, 0, px, py, pulse.size * 5);
    grad.addColorStop(0, `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, ${pulseAlpha})`);
    grad.addColorStop(0.3, `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, ${pulseAlpha * 0.4})`);
    grad.addColorStop(1, `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, 0)`);

    ctx.beginPath();
    ctx.arc(px, py, pulse.size * 5, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.min(pulse.color.r + 80, 255)}, ${Math.min(pulse.color.g + 80, 255)}, ${Math.min(pulse.color.b + 80, 255)}, ${pulseAlpha})`;
    ctx.fill();
  }

  // Draw nodes
  for (const node of circuitNodes) {
    const pulse = 1 + 0.3 * Math.sin(time * node.pulseSpeed + node.pulsePhase);

    // Node glow
    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 12);
    grad.addColorStop(0, `rgba(6, 182, 212, ${0.15 * pulse})`);
    grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.beginPath();
    ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Node core
    ctx.beginPath();
    ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(6, 182, 212, ${0.3 * pulse})`;
    ctx.fill();

    // Node ring
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 * pulse})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}

// ==================== NEURAL (Skills) ====================
interface NeuralNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  layer: number;
  connections: number[];
}

interface NeuralPulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

function drawNeural(
  canvas: HTMLCanvasElement,
  neuralNodes: NeuralNode[],
  neuralPulses: NeuralPulse[],
  time: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  // Gentle node oscillation
  for (const node of neuralNodes) {
    node.x = node.baseX + Math.sin(time * 0.0005 + node.pulsePhase) * 8;
    node.y = node.baseY + Math.cos(time * 0.0004 + node.pulsePhase * 1.3) * 6;
  }

  // Draw connections
  const drawnPairs = new Set<string>();
  for (let i = 0; i < neuralNodes.length; i++) {
    const node = neuralNodes[i];
    for (const j of node.connections) {
      const pairKey = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (drawnPairs.has(pairKey)) continue;
      drawnPairs.add(pairKey);

      const other = neuralNodes[j];
      if (!other) continue;

      // Bezier curve connection
      const midX = (node.x + other.x) / 2;
      const midY = (node.y + other.y) / 2 - 20;
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.quadraticCurveTo(midX, midY, other.x, other.y);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  // Update & draw pulses along connections
  for (let i = neuralPulses.length - 1; i >= 0; i--) {
    const pulse = neuralPulses[i];
    pulse.progress += pulse.speed;
    if (pulse.progress >= 1) {
      // Re-spawn
      const fromIdx = Math.floor(Math.random() * neuralNodes.length);
      const from = neuralNodes[fromIdx];
      if (from.connections.length > 0) {
        const toIdx = from.connections[Math.floor(Math.random() * from.connections.length)];
        pulse.fromNode = fromIdx;
        pulse.toNode = toIdx;
        pulse.progress = 0;
      } else {
        neuralPulses.splice(i, 1);
      }
      continue;
    }

    const from = neuralNodes[pulse.fromNode];
    const to = neuralNodes[pulse.toNode];
    if (!from || !to) continue;

    const t = pulse.progress;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2 - 20;

    // Quadratic bezier interpolation
    const px = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * midX + t * t * to.x;
    const py = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * midY + t * t * to.y;

    const alpha = Math.sin(t * Math.PI) * 0.7;

    const grad = ctx.createRadialGradient(px, py, 0, px, py, 10);
    grad.addColorStop(0, `rgba(56, 189, 248, ${alpha})`);
    grad.addColorStop(0.5, `rgba(56, 189, 248, ${alpha * 0.3})`);
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(130, 220, 255, ${alpha})`;
    ctx.fill();
  }

  // Draw nodes
  for (const node of neuralNodes) {
    const pulse = 1 + 0.4 * Math.sin(time * node.pulseSpeed + node.pulsePhase);

    // Outer glow
    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3);
    grad.addColorStop(0, `rgba(56, 189, 248, ${0.08 * pulse})`);
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56, 189, 248, ${0.2 * pulse})`;
    ctx.fill();

    // Bright center
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(130, 220, 255, ${0.5 * pulse})`;
    ctx.fill();
  }
}

// ==================== AURORA (Contact) ====================
interface AuroraWave {
  y: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  color: { r: number; g: number; b: number };
  alpha: number;
  width: number;
}

function drawAurora(canvas: HTMLCanvasElement, waves: AuroraWave[], time: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  // Draw each aurora wave
  for (const wave of waves) {
    ctx.beginPath();
    const baseY = h * wave.y;
    const offset = time * wave.speed;

    // Top edge of the wave band
    for (let x = 0; x <= w; x += 3) {
      const y = baseY
        + Math.sin(x * wave.frequency + offset + wave.phase) * wave.amplitude
        + Math.sin(x * wave.frequency * 0.5 + offset * 1.5) * wave.amplitude * 0.5
        + Math.sin(x * wave.frequency * 2 + offset * 0.7) * wave.amplitude * 0.2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // Bottom edge (offset)
    for (let x = w; x >= 0; x -= 3) {
      const y = baseY + wave.width
        + Math.sin(x * wave.frequency * 0.8 + offset + wave.phase + 1) * wave.amplitude * 0.6
        + Math.sin(x * wave.frequency * 0.3 + offset * 1.2) * wave.amplitude * 0.3;
      ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Gradient fill for the aurora band
    const grad = ctx.createLinearGradient(0, baseY - wave.amplitude, 0, baseY + wave.width + wave.amplitude);
    grad.addColorStop(0, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, 0)`);
    grad.addColorStop(0.3, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.alpha})`);
    grad.addColorStop(0.6, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.alpha * 0.7})`);
    grad.addColorStop(1, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, 0)`);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Add subtle stars/sparkles
  ctx.globalCompositeOperation = 'screen';
  const starCount = 15;
  for (let i = 0; i < starCount; i++) {
    const sx = ((Math.sin(i * 137.508 + time * 0.0001) + 1) / 2) * w;
    const sy = ((Math.cos(i * 73.254 + time * 0.00008) + 1) / 2) * h;
    const sa = 0.3 + 0.4 * Math.sin(time * 0.002 + i * 2.5);
    const sr = 1 + Math.sin(time * 0.003 + i) * 0.5;

    const sGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 4);
    sGrad.addColorStop(0, `rgba(255, 255, 255, ${sa * 0.6})`);
    sGrad.addColorStop(0.5, `rgba(56, 189, 248, ${sa * 0.2})`);
    sGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 4, 0, Math.PI * 2);
    ctx.fillStyle = sGrad;
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
}

// ==================== MAIN COMPONENT ====================

export default function SectionBackground({ variant }: SectionBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // State refs for each animation type
  const constellationNodesRef = useRef<ConstellationNode[]>([]);
  const dataStreamsRef = useRef<DataStream[]>([]);
  const dataPulsesRef = useRef<DataPulse[]>([]);
  const circuitNodesRef = useRef<CircuitNode[]>([]);
  const circuitPulsesRef = useRef<CircuitPulse[]>([]);
  const neuralNodesRef = useRef<NeuralNode[]>([]);
  const neuralPulsesRef = useRef<NeuralPulse[]>([]);
  const auroraWavesRef = useRef<AuroraWave[]>([]);
  const initRef = useRef(false);

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

    // Initialize animations based on variant
    if (!initRef.current) {
      initRef.current = true;

      if (variant === 'constellation') {
        const nodeCount = Math.floor((w() * h()) / 12000);
        const nodes: ConstellationNode[] = [];
        for (let i = 0; i < Math.max(nodeCount, 30); i++) {
          nodes.push({
            x: Math.random() * w(),
            y: Math.random() * h(),
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: 1.5 + Math.random() * 2,
            baseAlpha: 0.3 + Math.random() * 0.4,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.001 + Math.random() * 0.002,
          });
        }
        constellationNodesRef.current = nodes;
      }

      if (variant === 'data-stream') {
        const streamCount = Math.floor(w() / 40);
        const colors = [
          { r: 6, g: 182, b: 212 },  // cyan
          { r: 59, g: 130, b: 246 },  // blue
          { r: 129, g: 140, b: 248 }, // indigo
          { r: 56, g: 189, b: 248 },  // sky
        ];
        const streams: DataStream[] = [];
        for (let i = 0; i < Math.max(streamCount, 20); i++) {
          streams.push({
            x: Math.random() * w(),
            y: Math.random() * h(),
            speed: 0.3 + Math.random() * 1.2,
            length: 30 + Math.random() * 80,
            alpha: 0.05 + Math.random() * 0.12,
            width: 0.5 + Math.random() * 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            pulsePhase: Math.random() * Math.PI * 2,
            pulseInterval: 2000 + Math.random() * 5000,
            nextPulse: Date.now() + Math.random() * 3000,
          });
        }
        dataStreamsRef.current = streams;
        dataPulsesRef.current = [];
      }

      if (variant === 'circuit') {
        // Create grid-based circuit nodes
        const cols = Math.floor(w() / 80);
        const rows = Math.floor(h() / 80);
        const nodes: CircuitNode[] = [];
        const nodeMap: (number | null)[][] = [];

        let idx = 0;
        for (let row = 0; row < rows; row++) {
          nodeMap[row] = [];
          for (let col = 0; col < cols; col++) {
            // Skip some nodes randomly for organic feel
            if (Math.random() < 0.3) {
              nodeMap[row][col] = null;
              continue;
            }
            const jitterX = (Math.random() - 0.5) * 20;
            const jitterY = (Math.random() - 0.5) * 20;
            nodes.push({
              x: col * 80 + 40 + jitterX,
              y: row * 80 + 40 + jitterY,
              connections: [],
              pulsePhase: Math.random() * Math.PI * 2,
              pulseSpeed: 0.001 + Math.random() * 0.002,
              glowAlpha: 0.2 + Math.random() * 0.3,
            });
            nodeMap[row][col] = idx;
            idx++;
          }
        }

        // Connect adjacent nodes
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const currentIdx = nodeMap[row][col];
            if (currentIdx === null) continue;

            // Right neighbor
            if (col + 1 < cols && nodeMap[row][col + 1] !== null) {
              if (Math.random() < 0.6) {
                nodes[currentIdx].connections.push(nodeMap[row][col + 1]!);
              }
            }
            // Bottom neighbor
            if (row + 1 < rows && nodeMap[row + 1][col] !== null) {
              if (Math.random() < 0.6) {
                nodes[currentIdx].connections.push(nodeMap[row + 1][col]!);
              }
            }
            // Diagonal bottom-right
            if (row + 1 < rows && col + 1 < cols && nodeMap[row + 1][col + 1] !== null) {
              if (Math.random() < 0.25) {
                nodes[currentIdx].connections.push(nodeMap[row + 1][col + 1]!);
              }
            }
          }
        }

        circuitNodesRef.current = nodes;

        // Create traveling pulses
        const pulses: CircuitPulse[] = [];
        const pulseColors = [
          { r: 6, g: 182, b: 212 },
          { r: 59, g: 130, b: 246 },
          { r: 56, g: 189, b: 248 },
        ];
        for (let i = 0; i < Math.min(8, nodes.length / 3); i++) {
          const fromIdx = Math.floor(Math.random() * nodes.length);
          const from = nodes[fromIdx];
          if (from.connections.length > 0) {
            const toIdx = from.connections[Math.floor(Math.random() * from.connections.length)];
            pulses.push({
              fromNode: fromIdx,
              toNode: toIdx,
              progress: Math.random(),
              speed: 0.003 + Math.random() * 0.005,
              color: pulseColors[Math.floor(Math.random() * pulseColors.length)],
              size: 2 + Math.random() * 2,
            });
          }
        }
        circuitPulsesRef.current = pulses;
      }

      if (variant === 'neural') {
        // Create layered neural network nodes
        const layers = 5;
        const nodesPerLayer = Math.floor(h() / 80);
        const nodes: NeuralNode[] = [];
        const layerNodes: number[][] = [];

        for (let l = 0; l < layers; l++) {
          layerNodes[l] = [];
          const count = Math.max(nodesPerLayer - Math.abs(l - Math.floor(layers / 2)) * 2, 3);
          for (let n = 0; n < count; n++) {
            const baseX = (w() / (layers + 1)) * (l + 1);
            const baseY = (h() / (count + 1)) * (n + 1);
            const idx = nodes.length;
            nodes.push({
              x: baseX,
              y: baseY,
              baseX,
              baseY,
              radius: 3 + Math.random() * 3,
              pulsePhase: Math.random() * Math.PI * 2,
              pulseSpeed: 0.001 + Math.random() * 0.002,
              layer: l,
              connections: [],
            });
            layerNodes[l].push(idx);
          }
        }

        // Connect to next layer
        for (let l = 0; l < layers - 1; l++) {
          for (const fromIdx of layerNodes[l]) {
            for (const toIdx of layerNodes[l + 1]) {
              if (Math.random() < 0.4) {
                nodes[fromIdx].connections.push(toIdx);
              }
            }
          }
        }

        neuralNodesRef.current = nodes;

        // Create pulses
        const pulses: NeuralPulse[] = [];
        for (let i = 0; i < Math.min(10, nodes.length / 4); i++) {
          const fromIdx = Math.floor(Math.random() * nodes.length);
          const from = nodes[fromIdx];
          if (from.connections.length > 0) {
            const toIdx = from.connections[Math.floor(Math.random() * from.connections.length)];
            pulses.push({
              fromNode: fromIdx,
              toNode: toIdx,
              progress: Math.random(),
              speed: 0.004 + Math.random() * 0.006,
            });
          }
        }
        neuralPulsesRef.current = pulses;
      }

      if (variant === 'aurora') {
        const waves: AuroraWave[] = [
          {
            y: 0.3, amplitude: 40, frequency: 0.003, speed: 0.0004,
            phase: 0, color: { r: 59, g: 130, b: 246 }, alpha: 0.06, width: 60,
          },
          {
            y: 0.45, amplitude: 50, frequency: 0.002, speed: 0.0003,
            phase: 1.5, color: { r: 129, g: 140, b: 248 }, alpha: 0.05, width: 80,
          },
          {
            y: 0.55, amplitude: 35, frequency: 0.004, speed: 0.0005,
            phase: 3, color: { r: 56, g: 189, b: 248 }, alpha: 0.07, width: 50,
          },
          {
            y: 0.4, amplitude: 60, frequency: 0.0015, speed: 0.0002,
            phase: 2, color: { r: 6, g: 182, b: 212 }, alpha: 0.04, width: 100,
          },
          {
            y: 0.6, amplitude: 25, frequency: 0.005, speed: 0.0006,
            phase: 4.5, color: { r: 99, g: 102, b: 241 }, alpha: 0.05, width: 40,
          },
        ];
        auroraWavesRef.current = waves;
      }
    }

    const animate = () => {
      timeRef.current += 1;
      const t = timeRef.current;

      switch (variant) {
        case 'constellation':
          drawConstellation(canvas, constellationNodesRef.current, t);
          break;
        case 'data-stream':
          drawDataStream(canvas, dataStreamsRef.current, dataPulsesRef.current, Date.now());
          break;
        case 'circuit':
          drawCircuit(canvas, circuitNodesRef.current, circuitPulsesRef.current, t);
          break;
        case 'neural':
          drawNeural(canvas, neuralNodesRef.current, neuralPulsesRef.current, t);
          break;
        case 'aurora':
          drawAurora(canvas, auroraWavesRef.current, t);
          break;
      }

      // Vignette for all sections
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

      // Top/bottom fade for seamless section transitions
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
