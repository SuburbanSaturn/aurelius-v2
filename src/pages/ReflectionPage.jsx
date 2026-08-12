import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { submitReflection } from "../services/api";

const subtitles = [
  "Some begin with a question.",
  "Some begin with what they can no longer carry.",
  "There is no required form.",
  "Write what wants to leave the room with you.",
];

// --- Detonation particle generation ---
// Primary burst: fast, varied types (points, streaks, blocks)
const generatePrimaryBurst = () => {
  const particles = [];
  const count = 14;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const distance = 60 + Math.random() * 110;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    // Varied types: 0=point, 1=streak, 2=block
    const type = i < 5 ? 0 : i < 10 ? 1 : 2;
    const size = type === 0 ? 2 + Math.random() * 2 : type === 1 ? 1.5 : 3 + Math.random() * 4;
    const rotation = Math.random() * 180;
    // Stagger slightly for organic feel
    const delay = i * 0.012 + Math.random() * 0.03;
    const duration = 0.35 + Math.random() * 0.2;
    particles.push({ dx, dy, type, size, rotation, delay, duration, angle });
  }
  return particles;
};

// Secondary bloom: slower, larger, dimmer, fewer
const generateSecondaryBloom = () => {
  const particles = [];
  const count = 7;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const distance = 90 + Math.random() * 80;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const size = 4 + Math.random() * 5;
    const delay = 0.18 + Math.random() * 0.12; // delayed after primary
    const duration = 0.6 + Math.random() * 0.3;
    particles.push({ dx, dy, size, delay, duration, angle });
  }
  return particles;
};

// Embers: small fragments that drift with slight gravity
const generateEmbers = () => {
  const embers = [];
  const count = 5;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + 15 + Math.random() * 20; // slight downward bias
    const size = 1.5 + Math.random() * 1.5;
    const delay = 0.4 + Math.random() * 0.2;
    const duration = 0.7 + Math.random() * 0.4;
    embers.push({ dx, dy, size, delay, duration });
  }
  return embers;
};

export default function ReflectionPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [city, setCity] = useState("");
  const [theme, setTheme] = useState("");
  const [perspective, setPerspective] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [transmuting, setTransmuting] = useState(false);
  const [pendingAfterAnim, setPendingAfterAnim] = useState(false);
  const [compositionLocked, setCompositionLocked] = useState(false);
  const formRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const textareaRef = useRef(null);
  const unlockButtonRef = useRef(null);
  const fieldStateRef = useRef({
    pointerX: 0.5,
    pointerY: 0.5,
    pointerActive: false,
    focused: false,
    typing: false,
    transmuting: false,
    lastTypingTime: 0,
  });
  const primaryBurstRef = useRef(generatePrimaryBurst());
  const secondaryBloomRef = useRef(generateSecondaryBloom());
  const embersRef = useRef(generateEmbers());
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const subtitleTimer = setInterval(() => {
      setSubtitleIndex((currentIndex) => (currentIndex + 1) % subtitles.length);
    }, 4500);
    return () => clearInterval(subtitleTimer);
  }, []);

  // --- Canvas-based celestial ambient field ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height, dpr;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Celestial color palette
    const palette = [
      { r: 220, g: 50, b: 40 },   // deep crimson
      { r: 255, g: 80, b: 50 },   // ember red
      { r: 210, g: 160, b: 60 },  // warm gold
      { r: 140, g: 90, b: 160 },  // dusty violet
      { r: 180, g: 200, b: 230 }, // pale blue-white
      { r: 255, g: 245, b: 240 }, // near-white highlight
    ];

    const pickColor = (layer) => {
      if (layer === 0) return palette[Math.random() < 0.7 ? 0 : 1];
      if (layer === 1) {
        const r = Math.random();
        if (r < 0.35) return palette[0];
        if (r < 0.55) return palette[1];
        if (r < 0.7) return palette[2];
        if (r < 0.85) return palette[3];
        return palette[4];
      }
      const r = Math.random();
      if (r < 0.2) return palette[1];
      if (r < 0.35) return palette[2];
      if (r < 0.5) return palette[4];
      if (r < 0.65) return palette[5];
      if (r < 0.8) return palette[3];
      return palette[0];
    };

    const STAR_COUNT = 40;
    const PHENOMENA_COUNT = 8; // live animated objects
    const GLOW_COUNT = 3;
    const TRACE_COUNT = 3;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // --- Stars (simple points + red vortices) ---
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const layer = i < 12 ? 0 : i < 28 ? 1 : 2;
      let x, y;
      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? Math.random() * 0.2 : 0.8 + Math.random() * 0.2;
        y = Math.random();
      } else {
        x = Math.random();
        y = Math.random() < 0.5 ? Math.random() * 0.16 : 0.82 + Math.random() * 0.18;
      }
      const color = pickColor(layer);
      const size = layer === 0 ? 0.6 + Math.random() * 0.5
        : layer === 1 ? 1 + Math.random() * 0.8
        : 1.5 + Math.random() * 1.2;

      // Determine if this is a red star (crimson/ember) → becomes a vortex
      const isRed = (color.r > 180 && color.g < 100 && color.b < 80);

      stars.push({
        x, y, baseX: x, baseY: y, size, color, layer,
        isVortex: isRed,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: isRed ? (0.0006 + Math.random() * 0.001) * (Math.random() < 0.5 ? 1 : -1) : 0,
        baseOpacity: layer === 0 ? 0.1 + Math.random() * 0.08
          : layer === 1 ? 0.18 + Math.random() * 0.14
          : 0.3 + Math.random() * 0.2,
        opacity: 0,
        phase: Math.random() * Math.PI * 2,
        speed: (layer === 0 ? 0.0003 : layer === 1 ? 0.0005 : 0.0007) + Math.random() * 0.0003,
        driftRadius: 0.006 + Math.random() * 0.012,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.0004 + Math.random() * 0.0006,
        pulseActive: Math.random() < 0.12,
      });
    }

    // --- Live phenomena (distinct animated objects) ---
    // Types: 0=spinning star, 1=vortex, 2=charge sphere, 3=orbiting sparks, 4=micro galaxy
    const phenomena = [];
    const phenTypes = [0, 0, 1, 1, 2, 2, 3, 3]; // 2 spinning stars, 2 vortices, 2 charges, 2 orbiters
    for (let i = 0; i < PHENOMENA_COUNT; i++) {
      const pType = phenTypes[i];
      // Place in mid-to-edge regions
      let x = 0.1 + Math.random() * 0.8;
      let y = 0.1 + Math.random() * 0.8;
      // Avoid dead center (textarea region)
      if (x > 0.3 && x < 0.7 && y > 0.25 && y < 0.7) {
        x = Math.random() < 0.5 ? 0.08 + Math.random() * 0.2 : 0.75 + Math.random() * 0.18;
      }
      const color = pickColor(2); // near-layer colors for visibility
      phenomena.push({
        type: pType,
        x, y, baseX: x, baseY: y,
        color,
        size: pType === 4 ? 6 + Math.random() * 4 : 3 + Math.random() * 2.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (0.0008 + Math.random() * 0.001) * (Math.random() < 0.5 ? 1 : -1),
        phase: Math.random() * Math.PI * 2,
        moveSpeed: 0.00003 + Math.random() * 0.00004,
        moveAngle: Math.random() * Math.PI * 2,
        driftRadius: 0.015 + Math.random() * 0.02,
        baseOpacity: 0.3 + Math.random() * 0.2,
        opacity: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.001 + Math.random() * 0.001,
        // Orbiter-specific
        orbitCount: 2 + Math.floor(Math.random() * 2),
        orbitRadius: 5 + Math.random() * 4,
        orbitSpeed: 0.002 + Math.random() * 0.001,
      });
    }

    // --- Constellation groups ---
    const constellations = [];
    const used = new Set();
    for (let seed = 0; seed < stars.length && constellations.length < 3; seed++) {
      if (used.has(seed) || stars[seed].layer === 0) continue;
      const group = [seed];
      for (let j = 0; j < stars.length && group.length < 4; j++) {
        if (j === seed || used.has(j) || stars[j].layer === 0) continue;
        const dx = stars[seed].baseX - stars[j].baseX;
        const dy = stars[seed].baseY - stars[j].baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.13 && dist > 0.02) group.push(j);
      }
      if (group.length >= 3) {
        constellations.push(group);
        group.forEach(idx => used.add(idx));
      }
    }

    // --- Nebula glows ---
    const glows = [];
    const glowColors = [
      { r: 130, g: 20, b: 20 },
      { r: 80, g: 50, b: 100 },
      { r: 100, g: 70, b: 30 },
    ];
    for (let i = 0; i < GLOW_COUNT; i++) {
      const gc = glowColors[i];
      glows.push({
        x: 0.12 + Math.random() * 0.76,
        y: 0.15 + Math.random() * 0.65,
        radius: 65 + Math.random() * 50,
        baseOpacity: 0.022 + Math.random() * 0.015,
        opacity: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.00008 + Math.random() * 0.0001,
        driftX: (Math.random() - 0.5) * 0.007,
        driftY: (Math.random() - 0.5) * 0.005,
        color: gc,
      });
    }

    // --- Traces (traveling streaks) ---
    const traces = [];
    const traceColors = [
      { r: 255, g: 60, b: 50 },
      { r: 200, g: 150, b: 80 },
      { r: 160, g: 130, b: 200 },
    ];
    for (let i = 0; i < TRACE_COUNT; i++) {
      traces.push({
        x: Math.random(), y: Math.random(),
        angle: Math.random() * Math.PI * 2,
        length: 20 + Math.random() * 35,
        speed: 0.00006 + Math.random() * 0.00008,
        opacity: 0,
        baseOpacity: 0.045 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        cycleSpeed: 0.0003 + Math.random() * 0.0002,
        color: traceColors[i],
      });
    }

    let lastTime = performance.now();

    const render = (now) => {
      if (reducedMotion) {
        ctx.clearRect(0, 0, width, height);
        for (const s of stars) {
          ctx.beginPath();
          ctx.arc(s.baseX * width, s.baseY * height, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${s.baseOpacity * 0.5})`;
          ctx.fill();
        }
        for (const p of phenomena) {
          ctx.beginPath();
          ctx.arc(p.baseX * width, p.baseY * height, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.baseOpacity * 0.4})`;
          ctx.fill();
        }
        return;
      }

      animFrameRef.current = requestAnimationFrame(render);
      const dt = now - lastTime;
      lastTime = now;
      if (dt > 100) return;

      const state = fieldStateRef.current;
      const focusMul = state.focused ? 1.25 : 1;
      const typingMul = state.typing ? 1.12 : 1;
      const transmuteMul = state.transmuting ? 1.7 : 1;
      const activityMul = focusMul * typingMul * transmuteMul;

      ctx.clearRect(0, 0, width, height);

      // --- Nebula glows ---
      for (const g of glows) {
        g.phase += g.speed * dt;
        const breathe = 0.7 + 0.3 * Math.sin(g.phase);
        g.opacity = g.baseOpacity * breathe * activityMul;
        const gx = (g.x + Math.sin(g.phase * 0.7) * g.driftX) * width;
        const gy = (g.y + Math.cos(g.phase * 0.5) * g.driftY) * height;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.radius);
        grad.addColorStop(0, `rgba(${g.color.r}, ${g.color.g}, ${g.color.b}, ${g.opacity})`);
        grad.addColorStop(1, `rgba(${g.color.r}, ${g.color.g}, ${g.color.b}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(gx - g.radius, gy - g.radius, g.radius * 2, g.radius * 2);
      }

      // --- Stars (points + red vortices) ---
      for (const s of stars) {
        s.phase += s.speed * dt;
        s.x = s.baseX + Math.sin(s.phase) * s.driftRadius;
        s.y = s.baseY + Math.cos(s.phase * 0.7) * s.driftRadius;
        if (s.isVortex) s.rotation += s.rotSpeed * dt;

        let pointerInf = 0;
        if (state.pointerActive) {
          const dx = s.x - state.pointerX;
          const dy = s.y - state.pointerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.18) {
            const str = (1 - dist / 0.18) * 0.006 * (s.layer + 1);
            s.x += dx * str;
            s.y += dy * str;
            pointerInf = (1 - dist / 0.18) * 0.1;
          }
        }

        let op = s.baseOpacity * activityMul + pointerInf;
        if (s.pulseActive) {
          s.pulsePhase += s.pulseSpeed * dt;
          op += Math.max(0, Math.sin(s.pulsePhase)) * 0.15;
          if (s.pulsePhase > Math.PI * 6) { s.pulseActive = false; s.pulsePhase = 0; }
        }
        s.opacity = Math.min(op, 0.8);

        const px = s.x * width;
        const py = s.y * height;
        const { r, g, b } = s.color;

        if (s.isVortex) {
          // Red vortex: rotating partial arcs (miniature swirling plasma)
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(s.rotation);
          // Center glow
          ctx.beginPath();
          ctx.arc(0, 0, s.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.8})`;
          ctx.fill();
          // Inner arc
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, s.size * 0.7, 0, Math.PI * 1.1);
          ctx.stroke();
          // Outer arc (counter-rotated feel via offset start)
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.25})`;
          ctx.beginPath();
          ctx.arc(0, 0, s.size * 1.1, Math.PI * 0.8, Math.PI * 1.9);
          ctx.stroke();
          ctx.restore();
        } else {
          // Regular star point
          ctx.beginPath();
          ctx.arc(px, py, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity})`;
          ctx.fill();

          // Soft glow for near-layer non-red stars
          if (s.layer === 2 && s.opacity > 0.28) {
            ctx.beginPath();
            ctx.arc(px, py, s.size + 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.1})`;
            ctx.fill();
          }
        }
      }

      // --- Live phenomena ---
      for (const p of phenomena) {
        p.phase += p.moveSpeed * dt;
        p.rotation += p.rotSpeed * dt;
        p.pulsePhase += p.pulseSpeed * dt;

        // Drift motion (curved paths)
        p.x = p.baseX + Math.sin(p.phase * 0.6 + p.moveAngle) * p.driftRadius;
        p.y = p.baseY + Math.cos(p.phase * 0.4 + p.moveAngle * 0.7) * p.driftRadius * 0.8;

        // Slow travel across viewport
        p.baseX += Math.cos(p.moveAngle) * p.moveSpeed * dt * 0.3;
        p.baseY += Math.sin(p.moveAngle) * p.moveSpeed * dt * 0.3;
        // Wrap
        if (p.baseX < -0.05) p.baseX = 1.05;
        if (p.baseX > 1.05) p.baseX = -0.05;
        if (p.baseY < -0.05) p.baseY = 1.05;
        if (p.baseY > 1.05) p.baseY = -0.05;

        const pulse = 0.8 + 0.2 * Math.sin(p.pulsePhase);
        p.opacity = Math.min(p.baseOpacity * pulse * activityMul, 0.75);

        const px = p.x * width;
        const py = p.y * height;
        const { r, g, b } = p.color;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rotation);

        if (p.type === 0) {
          // Spinning star: core + 4 rays
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
          ctx.fill();
          // Rays
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.4})`;
          ctx.lineWidth = 0.6;
          for (let ray = 0; ray < 4; ray++) {
            const angle = (ray / 4) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * p.size * 0.5, Math.sin(angle) * p.size * 0.5);
            ctx.lineTo(Math.cos(angle) * p.size * 1.2, Math.sin(angle) * p.size * 1.2);
            ctx.stroke();
          }
          // Soft halo
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.06})`;
          ctx.fill();

        } else if (p.type === 1) {
          // Vortex: concentric partial arcs
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 1.3);
          ctx.stroke();
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.3})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.0, Math.PI * 0.5, Math.PI * 1.8);
          ctx.stroke();
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.15})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.4, Math.PI, Math.PI * 2.2);
          ctx.stroke();
          // Center glow
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.6})`;
          ctx.fill();

        } else if (p.type === 2) {
          // Charge sphere: luminous core + halo + occasional bright pulse
          const chargeOp = p.opacity * (0.9 + 0.1 * Math.sin(p.pulsePhase * 3));
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${chargeOp})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${chargeOp * 0.12})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${chargeOp * 0.04})`;
          ctx.fill();

        } else if (p.type === 3) {
          // Orbiting sparks: center dot + orbiting smaller dots
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.7})`;
          ctx.fill();
          // Orbiters (use separate orbit rotation from main rotation)
          const orbitAngleBase = p.phase * p.orbitSpeed * 50;
          for (let oi = 0; oi < p.orbitCount; oi++) {
            const oa = orbitAngleBase + (oi / p.orbitCount) * Math.PI * 2;
            const ox = Math.cos(oa) * p.orbitRadius;
            const oy = Math.sin(oa) * p.orbitRadius;
            ctx.beginPath();
            ctx.arc(ox, oy, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.5})`;
            ctx.fill();
          }
          // Faint connecting ring
          ctx.beginPath();
          ctx.arc(0, 0, p.orbitRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.06})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();

        } else if (p.type === 4) {
          // Micro galaxy: elliptical swirl
          ctx.scale(1, 0.5);
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.08})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.15})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.4})`;
          ctx.fill();
        }

        ctx.restore();
      }

      // --- Constellation lines ---
      const constOp = 0.03 * activityMul;
      if (constOp > 0.012) {
        ctx.lineWidth = 0.4;
        for (const group of constellations) {
          for (let i = 0; i < group.length - 1; i++) {
            const a = stars[group[i]];
            const b = stars[group[i + 1]];
            const avgR = (a.color.r + b.color.r) >> 1;
            const avgG = (a.color.g + b.color.g) >> 1;
            const avgB = (a.color.b + b.color.b) >> 1;
            ctx.strokeStyle = `rgba(${avgR}, ${avgG}, ${avgB}, ${constOp})`;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }

      // --- Traces ---
      for (const t of traces) {
        t.phase += t.cycleSpeed * dt;
        const cycle = Math.sin(t.phase);
        t.opacity = cycle > 0 ? t.baseOpacity * cycle * activityMul : 0;
        if (t.opacity < 0.004) continue;
        t.x += Math.cos(t.angle) * t.speed * dt;
        t.y += Math.sin(t.angle) * t.speed * dt;
        if (t.x < -0.05) t.x = 1.05;
        if (t.x > 1.05) t.x = -0.05;
        if (t.y < -0.05) t.y = 1.05;
        if (t.y > 1.05) t.y = -0.05;
        const tx = t.x * width;
        const ty = t.y * height;
        const ex = tx + Math.cos(t.angle) * t.length;
        const ey = ty + Math.sin(t.angle) * t.length;
        const { r, g, b } = t.color;
        const grad = ctx.createLinearGradient(tx, ty, ex, ey);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${t.opacity})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }

      // --- Rare pulse ---
      if (Math.random() < 0.0004 * dt) {
        const candidate = stars[Math.floor(Math.random() * stars.length)];
        if (!candidate.pulseActive) {
          candidate.pulseActive = true;
          candidate.pulsePhase = 0;
        }
      }
    };

    if (reducedMotion) {
      render(performance.now());
    } else {
      animFrameRef.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => { fieldStateRef.current.focused = isFocused; }, [isFocused]);
  useEffect(() => { fieldStateRef.current.typing = isTyping; }, [isTyping]);
  useEffect(() => { fieldStateRef.current.transmuting = transmuting; }, [transmuting]);

  const handlePointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    fieldStateRef.current.pointerX = (e.clientX - rect.left) / rect.width;
    fieldStateRef.current.pointerY = (e.clientY - rect.top) / rect.height;
    fieldStateRef.current.pointerActive = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    fieldStateRef.current.pointerActive = false;
  }, []);

  const handleContentChange = useCallback((e) => {
    if (compositionLocked) return;
    setContent(e.target.value);
    fieldStateRef.current.lastTypingTime = performance.now();
    if (!isTyping) setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1200);
  }, [isTyping, compositionLocked]);

  const handleExternalInputBlocked = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!compositionLocked) {
      setCompositionLocked(true);
      // Move focus to unlock button after a brief delay for DOM update
      setTimeout(() => {
        unlockButtonRef.current?.focus();
      }, 60);
    }
  }, [compositionLocked]);

  const handleUnlock = useCallback(() => {
    setCompositionLocked(false);
    // Return focus to textarea
    setTimeout(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        // Place caret at end of existing text
        const len = ta.value.length;
        ta.setSelectionRange(len, len);
      }
    }, 30);
  }, []);

  // Prevent keyboard input while locked (belt-and-suspenders with readOnly)
  const handleKeyDown = useCallback((e) => {
    if (compositionLocked) {
      // Allow Tab so keyboard users can reach the unlock button
      if (e.key !== "Tab") {
        e.preventDefault();
      }
    }
  }, [compositionLocked]);

  const handleCategoryChange = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitMessage("");

    const payload = {
      content,
      categories,
      location: { city },
      theme,
      perspective,
      timestamp: new Date().toISOString(),
    };

    console.log("🧠 Reflection Payload:", payload);

    // Regenerate detonation particles
    primaryBurstRef.current = generatePrimaryBurst();
    secondaryBloomRef.current = generateSecondaryBloom();
    embersRef.current = generateEmbers();

    setTransmuting(true);
    setIsSubmitting(true);

    const animDuration = 1100; // full spectacle
    let animFinished = false;
    let requestResult = null;
    let requestError = null;

    const animPromise = new Promise((resolve) => {
      setTimeout(() => { animFinished = true; resolve(); }, animDuration);
    });

    const requestPromise = (async () => {
      try {
        const result = await submitReflection(payload);
        console.log("✅ API RESPONSE:", result);
        requestResult = result;
      } catch (err) {
        console.error("❌ API ERROR:", err);
        requestError = err;
      }
    })();

    await Promise.all([animPromise, requestPromise]);

    if (requestError) {
      setTransmuting(false);
      setIsSubmitting(false);
      const errorMessage =
        requestError?.message ||
        "This reflection could not be accepted right now. Please revise and try again.";
      setSubmitMessage(errorMessage);
      return;
    }

    if (!animFinished) {
      setPendingAfterAnim(true);
      await animPromise;
      setPendingAfterAnim(false);
    }

    setContent("");
    setCategories([]);
    setCity("");
    setTheme("");
    setPerspective("");
    setTransmuting(false);
    setIsSubmitting(false);

    navigate("/submitted", {
      state: {
        moderationStatus: requestResult.moderation_status || "approved",
        moderationReason: requestResult.moderation_reason || "public_safe",
        visibility: requestResult.visibility || "public",
        analysisEligible: requestResult.analysis_eligible ?? true,
        shadowEligible: requestResult.shadow_eligible ?? false,
        piiRedacted: requestResult.pii_redacted ?? false,
        semanticPrivacyApplied: requestResult.semantic_privacy_applied ?? false,
      },
    });
  }, [content, categories, city, theme, perspective, navigate]);

  return (
    <main
      className={`reflection-page${isFocused ? " reflection-page--focused" : ""}${transmuting ? " reflection-page--transmuting" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <style>{`
        .reflection-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 38%, rgba(120, 15, 15, 0.28), transparent 30%),
            radial-gradient(circle at 50% 86%, rgba(80, 5, 5, 0.22), transparent 36%),
            radial-gradient(circle at 18% 28%, rgba(190, 35, 35, 0.14), transparent 8%),
            radial-gradient(circle at 82% 24%, rgba(180, 25, 25, 0.14), transparent 7%),
            rgba(2, 1, 1, 0.82);
          color: rgba(255, 245, 245, 0.88);
          padding: 72px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .reflection-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .reflection-shell {
          width: 100%;
          max-width: 780px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .reflection-kicker {
          margin: 0 0 14px;
          letter-spacing: 3px;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: rgba(255, 220, 220, 0.36);
        }

        .reflection-title {
          margin: 0;
          font-size: clamp(2rem, 5vw, 3.8rem);
          font-weight: 300;
          letter-spacing: 0.16em;
          color: rgba(255, 240, 240, 0.88);
          text-shadow: 0 0 22px rgba(255, 90, 90, 0.08);
          position: relative;
        }

        .reflection-title-text {
          background: linear-gradient(
            90deg,
            rgba(255, 240, 240, 0.88) 0%,
            rgba(255, 240, 240, 0.88) 44%,
            rgba(255, 195, 140, 1) 49%,
            rgba(255, 220, 170, 1) 51%,
            rgba(255, 240, 240, 0.88) 56%,
            rgba(255, 240, 240, 0.88) 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: titleLightPass 10s ease-in-out infinite;
        }

        .reflection-title-glow {
          position: absolute;
          inset: -8px -16px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(200, 60, 40, 0.12), transparent 70%);
          pointer-events: none;
          animation: titleBreathe 8s ease-in-out infinite;
        }

        @keyframes titleLightPass {
          0%, 100% { background-position: 100% 0; }
          50% { background-position: -100% 0; }
        }

        @keyframes titleBreathe {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.04); }
        }

        .reflection-subtitle-wrap {
          min-height: 58px;
          margin-top: 20px;
          margin-bottom: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reflection-subtitle {
          margin: 0;
          color: rgba(255, 220, 220, 0.42);
          line-height: 1.8;
          animation: subtitleFade 4.5s ease-in-out infinite;
        }

        .reflection-form {
          animation: fadeUp 420ms ease both;
          position: relative;
        }

        .reflection-form--transmuting {
          pointer-events: none;
        }

        /* ===== TRANSMUTATION SEQUENCE ===== */

        .detonation-layer {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Ignition flash */
        .detonation-flash {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 200, 180, 0.95);
          box-shadow:
            0 0 20px rgba(255, 120, 80, 0.9),
            0 0 60px rgba(255, 60, 40, 0.6),
            0 0 100px rgba(200, 20, 20, 0.3);
          opacity: 0;
          animation: ignitionFlash 0.3s ease-out 0.14s forwards;
        }

        /* Primary burst particles */
        .detonation-point {
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 70, 50, 0.9);
          will-change: transform, opacity;
          opacity: 0;
          animation: burstPoint var(--burst-dur) cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--burst-delay);
        }

        .detonation-streak {
          position: absolute;
          width: var(--streak-w);
          height: 1.5px;
          background: linear-gradient(90deg, rgba(255, 80, 60, 0.9), rgba(255, 40, 40, 0));
          will-change: transform, opacity;
          opacity: 0;
          transform-origin: left center;
          animation: burstStreak var(--burst-dur) cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--burst-delay);
        }

        .detonation-block {
          position: absolute;
          background: rgba(255, 55, 45, 0.85);
          will-change: transform, opacity;
          opacity: 0;
          animation: burstBlock var(--burst-dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--burst-delay);
        }

        /* Secondary bloom */
        .detonation-bloom {
          position: absolute;
          border-radius: 999px;
          background: rgba(180, 30, 20, 0.5);
          box-shadow: 0 0 12px rgba(200, 40, 30, 0.3);
          will-change: transform, opacity;
          opacity: 0;
          animation: bloomExpand var(--bloom-dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--bloom-delay);
        }

        /* Embers */
        .detonation-ember {
          position: absolute;
          width: var(--ember-size);
          height: var(--ember-size);
          border-radius: 999px;
          background: rgba(255, 90, 50, 0.7);
          will-change: transform, opacity;
          opacity: 0;
          animation: emberDrift var(--ember-dur) ease-out forwards;
          animation-delay: var(--ember-delay);
        }

        /* Pending dots */
        .transmutation-pending {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .transmutation-pending-dot {
          width: 4px;
          height: 4px;
          margin: 0 4px;
          border-radius: 999px;
          background: rgba(255, 80, 80, 0.7);
          animation: pendingPulse 1.2s ease-in-out infinite;
        }
        .transmutation-pending-dot:nth-child(2) { animation-delay: 0.2s; }
        .transmutation-pending-dot:nth-child(3) { animation-delay: 0.4s; }

        /* Textarea */
        .reflection-textarea-wrap {
          position: relative;
        }

        .reflection-textarea {
          width: 100%;
          min-height: 230px;
          padding: 28px;
          resize: vertical;
          border-radius: 4px;
          border: 1px solid rgba(155, 35, 35, 0.28);
          outline: none;
          background: rgba(20, 2, 2, 0.34);
          box-shadow:
            0 0 60px rgba(125, 10, 10, 0.24),
            inset 0 0 42px rgba(70, 0, 0, 0.28);
          color: rgba(255, 245, 245, 0.9);
          font-size: 1rem;
          line-height: 1.8;
          transition: border-color 320ms ease, box-shadow 420ms ease, background 320ms ease;
        }

        .reflection-textarea:focus {
          border-color: rgba(255, 80, 80, 0.48);
          background: rgba(24, 3, 3, 0.46);
          box-shadow:
            0 0 80px rgba(145, 22, 22, 0.32),
            inset 0 0 52px rgba(70, 0, 0, 0.34);
        }

        .reflection-textarea-glow {
          position: absolute;
          inset: -2px;
          border-radius: 6px;
          pointer-events: none;
          opacity: 0;
          box-shadow: 0 0 36px rgba(255, 60, 60, 0.1);
          transition: opacity 600ms ease;
        }

        .reflection-textarea:focus ~ .reflection-textarea-glow {
          opacity: 1;
          animation: textareaBreath 4s ease-in-out infinite;
        }

        /* ===== COMPOSITION LOCKED STATE ===== */
        .reflection-textarea-wrap--locked {
          position: relative;
        }

        .reflection-textarea-wrap--locked .reflection-textarea {
          border-color: rgba(90, 85, 80, 0.35);
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 11px,
              rgba(100, 80, 70, 0.035) 11px,
              rgba(100, 80, 70, 0.035) 12px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 11px,
              rgba(100, 80, 70, 0.035) 11px,
              rgba(100, 80, 70, 0.035) 12px
            ),
            rgba(8, 7, 6, 0.6);
          box-shadow:
            0 0 20px rgba(40, 35, 30, 0.15),
            inset 0 0 24px rgba(30, 25, 20, 0.2);
          color: rgba(200, 190, 185, 0.3);
          animation: lockEngage 0.35s ease-out forwards;
        }

        .reflection-textarea-wrap--locked .reflection-textarea-glow {
          opacity: 0 !important;
          animation: none !important;
        }

        /* Lock overlay */
        .composition-lock-overlay {
          position: absolute;
          inset: 0;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          z-index: 5;
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 23px,
              rgba(120, 90, 80, 0.025) 23px,
              rgba(120, 90, 80, 0.025) 24px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 23px,
              rgba(120, 90, 80, 0.025) 23px,
              rgba(120, 90, 80, 0.025) 24px
            ),
            transparent;
          animation: lockOverlayIn 0.3s ease-out forwards;
        }

        .composition-lock-icon {
          font-size: 1.4rem;
          color: rgba(180, 140, 130, 0.5);
          text-shadow: 0 0 8px rgba(140, 80, 60, 0.15);
        }

        .composition-lock-message {
          margin: 0;
          max-width: 320px;
          color: rgba(200, 180, 170, 0.55);
          font-size: 0.82rem;
          line-height: 1.6;
          text-align: center;
          letter-spacing: 0.02em;
        }

        .composition-lock-unlock {
          margin-top: 8px;
          padding: 10px 22px;
          border: 1px solid rgba(155, 100, 90, 0.3);
          border-radius: 2px;
          background: rgba(40, 15, 12, 0.4);
          color: rgba(220, 180, 170, 0.7);
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 200ms ease, color 200ms ease, box-shadow 200ms ease, background 200ms ease;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .composition-lock-unlock:hover {
          border-color: rgba(200, 120, 100, 0.45);
          color: rgba(240, 210, 200, 0.85);
          background: rgba(70, 20, 15, 0.5);
          box-shadow: 0 0 18px rgba(150, 50, 40, 0.15);
        }

        .composition-lock-unlock:focus-visible {
          outline: 2px solid rgba(200, 120, 100, 0.6);
          outline-offset: 3px;
        }

        @keyframes lockEngage {
          0% { opacity: 1; }
          20% { opacity: 0.7; }
          40% { opacity: 0.85; }
          100% { opacity: 1; }
        }

        @keyframes lockOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Transmutation: compression then dissolve */
        .reflection-page--transmuting .reflection-textarea {
          animation: textareaTransmute 0.75s ease-out forwards;
        }

        .reflection-page--transmuting .reflection-form {
          animation: formCompress 0.14s ease-in forwards;
        }

        .reflection-fields {
          margin: 30px auto 0;
          max-width: 580px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          text-align: left;
        }

        .reflection-label {
          color: rgba(255, 220, 220, 0.42);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
        }

        .reflection-label span {
          opacity: 0.5;
          font-style: italic;
          letter-spacing: 0;
        }

        .reflection-input {
          width: 100%;
          margin-top: 6px;
          padding: 12px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(155, 35, 35, 0.22);
          color: rgba(255, 245, 245, 0.82);
          outline: none;
          transition: border-color 280ms ease, color 180ms ease, box-shadow 280ms ease;
        }

        .reflection-input:focus {
          border-bottom-color: rgba(255, 80, 80, 0.48);
          color: rgba(255, 245, 245, 0.94);
          box-shadow: 0 2px 12px rgba(255, 60, 60, 0.08);
        }

        .reflection-categories {
          margin-top: 36px;
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .reflection-chip {
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(155, 35, 35, 0.22);
          background: rgba(20, 2, 2, 0.24);
          color: rgba(255, 235, 235, 0.66);
          cursor: pointer;
          transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
        }

        .reflection-chip:hover {
          transform: translateY(-2px) scale(1.03);
          border-color: rgba(255, 80, 80, 0.38);
          box-shadow: 0 0 20px rgba(145, 22, 22, 0.2);
        }

        .reflection-chip:active {
          transform: translateY(0px) scale(0.97);
          transition-duration: 80ms;
        }

        .reflection-chip.active {
          border-color: rgba(255, 120, 120, 0.58);
          background: rgba(125, 18, 18, 0.4);
          box-shadow: 0 0 24px rgba(145, 22, 22, 0.22);
        }

        .reflection-submit {
          margin-top: 44px;
          padding: 14px 42px;
          border-radius: 4px;
          border: 1px solid rgba(255, 90, 90, 0.28);
          background: rgba(105, 14, 14, 0.58);
          color: rgba(255, 235, 235, 0.82);
          box-shadow: 0 0 36px rgba(145, 22, 22, 0.24);
          cursor: pointer;
          transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 220ms ease, background 200ms ease, opacity 180ms ease, border-color 200ms ease;
        }

        .reflection-submit:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          background: rgba(135, 20, 20, 0.64);
          border-color: rgba(255, 110, 110, 0.42);
          box-shadow: 0 0 52px rgba(175, 30, 30, 0.36);
        }

        .reflection-submit:active:not(:disabled) {
          transform: translateY(0px) scale(0.97);
          box-shadow: 0 0 24px rgba(130, 18, 18, 0.3);
          transition-duration: 80ms;
        }

        .reflection-submit:disabled {
          background: rgba(60, 20, 20, 0.22);
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.58;
        }

        .reflection-footnote {
          margin-top: 18px;
          color: rgba(255, 220, 220, 0.28);
          font-size: 0.82rem;
        }

        .reflection-submit-message {
          max-width: 560px;
          margin: 24px auto 0;
          color: rgba(255, 190, 190, 0.72);
          font-size: 0.92rem;
          line-height: 1.7;
        }

        /* ===== KEYFRAMES ===== */

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes subtitleFade {
          0% { opacity: 0; transform: translateY(6px); }
          14% { opacity: 1; transform: translateY(0); }
          82% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }

        @keyframes textareaBreath {
          0%, 100% { box-shadow: 0 0 36px rgba(255, 60, 60, 0.08); }
          50% { box-shadow: 0 0 48px rgba(255, 60, 60, 0.15); }
        }

        /* Compression: brief inward contraction */
        @keyframes formCompress {
          0% { transform: scale(1); }
          100% { transform: scale(0.985); }
        }

        /* Textarea: compress then dissolve */
        @keyframes textareaTransmute {
          0% { opacity: 1; transform: scale(1); filter: blur(0); }
          18% { opacity: 0.9; transform: scale(0.97); filter: blur(0); }
          40% { opacity: 0.5; transform: scale(0.97); filter: blur(1px); }
          100% { opacity: 0; transform: scale(0.94); filter: blur(2.5px); }
        }

        /* Ignition: sharp flash */
        @keyframes ignitionFlash {
          0% { opacity: 0; transform: scale(0.3); }
          30% { opacity: 1; transform: scale(1.8); }
          60% { opacity: 0.8; transform: scale(2.5); }
          100% { opacity: 0; transform: scale(4); }
        }

        /* Primary burst: points */
        @keyframes burstPoint {
          0% { opacity: 0.95; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.7; }
          100% { opacity: 0; transform: translate(var(--burst-dx), var(--burst-dy)) scale(0.2); }
        }

        /* Primary burst: streaks */
        @keyframes burstStreak {
          0% { opacity: 0.9; transform: rotate(var(--burst-angle)) scaleX(0.3) translateX(0); }
          30% { opacity: 0.85; transform: rotate(var(--burst-angle)) scaleX(1) translateX(20px); }
          100% { opacity: 0; transform: rotate(var(--burst-angle)) scaleX(0.6) translateX(var(--burst-dist)); }
        }

        /* Primary burst: blocks */
        @keyframes burstBlock {
          0% { opacity: 0.9; transform: translate(0, 0) rotate(var(--burst-rot)) scale(1); }
          40% { opacity: 0.7; }
          100% { opacity: 0; transform: translate(var(--burst-dx), var(--burst-dy)) rotate(calc(var(--burst-rot) + 40deg)) scale(0.3); }
        }

        /* Secondary bloom */
        @keyframes bloomExpand {
          0% { opacity: 0.5; transform: translate(0, 0) scale(0.5); }
          40% { opacity: 0.35; }
          100% { opacity: 0; transform: translate(var(--bloom-dx), var(--bloom-dy)) scale(1.8); }
        }

        /* Embers: drift with slight arc */
        @keyframes emberDrift {
          0% { opacity: 0.7; transform: translate(0, 0) scale(1); }
          30% { opacity: 0.6; }
          100% { opacity: 0; transform: translate(var(--ember-dx), var(--ember-dy)) scale(0.4); }
        }

        @keyframes pendingPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* ===== REDUCED MOTION ===== */
        @media (prefers-reduced-motion: reduce) {
          .reflection-subtitle,
          .reflection-textarea-glow,
          .reflection-title-text,
          .reflection-title-glow,
          .detonation-flash,
          .detonation-point,
          .detonation-streak,
          .detonation-block,
          .detonation-bloom,
          .detonation-ember,
          .transmutation-pending-dot {
            animation: none !important;
          }
          .reflection-title-text {
            -webkit-text-fill-color: rgba(255, 240, 240, 0.88);
            background: none;
          }
          .reflection-title-glow {
            opacity: 0.5;
          }
          .reflection-page--transmuting .reflection-textarea {
            animation: none !important;
            opacity: 0.3;
          }
          .reflection-page--transmuting .reflection-form {
            animation: none !important;
          }
          .reflection-chip,
          .reflection-submit {
            transition: none !important;
          }
          .reflection-textarea-wrap--locked .reflection-textarea {
            animation: none !important;
          }
          .composition-lock-overlay {
            animation: none !important;
            opacity: 1;
          }
          .composition-lock-unlock {
            transition: none !important;
          }
        }

        @media (max-width: 720px) {
          .reflection-page {
            padding: 48px 18px;
            align-items: flex-start;
          }
          .reflection-title {
            letter-spacing: 0.08em;
          }
          .reflection-textarea {
            min-height: 200px;
            padding: 22px;
          }
        }
      `}</style>

      <canvas ref={canvasRef} className="reflection-canvas" aria-hidden="true" />

      <section className="reflection-shell">
        <p className="reflection-kicker">Offering</p>

        <h1 className="reflection-title">
          <span className="reflection-title-glow" aria-hidden="true" />
          <span className="reflection-title-text">What would you like to release?</span>
        </h1>

        <div className="reflection-subtitle-wrap">
          <p key={subtitleIndex} className="reflection-subtitle">
            {subtitles[subtitleIndex]}
          </p>
        </div>

        <form
          ref={formRef}
          className={`reflection-form${transmuting ? " reflection-form--transmuting" : ""}`}
          onSubmit={handleSubmit}
        >
          <div className={`reflection-textarea-wrap${compositionLocked ? " reflection-textarea-wrap--locked" : ""}`}>
            <textarea
              ref={textareaRef}
              className="reflection-textarea"
              placeholder=""
              value={content}
              onChange={handleContentChange}
              onPaste={handleExternalInputBlocked}
              onDrop={handleExternalInputBlocked}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              readOnly={compositionLocked}
              rows={7}
              disabled={transmuting}
              aria-describedby={compositionLocked ? "composition-lock-desc" : undefined}
            />
            <span className="reflection-textarea-glow" aria-hidden="true" />
            {compositionLocked && (
              <div
                className="composition-lock-overlay"
                role="alertdialog"
                aria-modal="false"
                aria-labelledby="composition-lock-desc"
              >
                <span className="composition-lock-icon" aria-hidden="true">◉</span>
                <p className="composition-lock-message" id="composition-lock-desc">
                  Reflections are composed here rather than pasted.
                </p>
                <button
                  ref={unlockButtonRef}
                  type="button"
                  className="composition-lock-unlock"
                  onClick={handleUnlock}
                >
                  Return to writing
                </button>
              </div>
            )}
          </div>

          {/* Detonation sequence */}
          {transmuting && (
            <div className="detonation-layer" aria-hidden="true">
              {/* Ignition flash */}
              <span className="detonation-flash" />

              {/* Primary burst */}
              {primaryBurstRef.current.map((p, i) => {
                if (p.type === 0) {
                  return (
                    <span
                      key={`p-${i}`}
                      className="detonation-point"
                      style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        "--burst-dx": `${p.dx}px`,
                        "--burst-dy": `${p.dy}px`,
                        "--burst-delay": `${0.14 + p.delay}s`,
                        "--burst-dur": `${p.duration}s`,
                      }}
                    />
                  );
                }
                if (p.type === 1) {
                  const streakLen = 12 + Math.random() * 16;
                  return (
                    <span
                      key={`s-${i}`}
                      className="detonation-streak"
                      style={{
                        "--streak-w": `${streakLen}px`,
                        "--burst-angle": `${(p.angle * 180) / Math.PI}deg`,
                        "--burst-dist": `${Math.sqrt(p.dx * p.dx + p.dy * p.dy) * 0.7}px`,
                        "--burst-delay": `${0.14 + p.delay}s`,
                        "--burst-dur": `${p.duration}s`,
                      }}
                    />
                  );
                }
                // block
                return (
                  <span
                    key={`b-${i}`}
                    className="detonation-block"
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size * 0.5}px`,
                      "--burst-dx": `${p.dx}px`,
                      "--burst-dy": `${p.dy}px`,
                      "--burst-rot": `${p.rotation}deg`,
                      "--burst-delay": `${0.14 + p.delay}s`,
                      "--burst-dur": `${p.duration}s`,
                    }}
                  />
                );
              })}

              {/* Secondary bloom */}
              {secondaryBloomRef.current.map((b, i) => (
                <span
                  key={`bloom-${i}`}
                  className="detonation-bloom"
                  style={{
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    "--bloom-dx": `${b.dx}px`,
                    "--bloom-dy": `${b.dy}px`,
                    "--bloom-delay": `${0.14 + b.delay}s`,
                    "--bloom-dur": `${b.duration}s`,
                  }}
                />
              ))}

              {/* Embers */}
              {embersRef.current.map((em, i) => (
                <span
                  key={`ember-${i}`}
                  className="detonation-ember"
                  style={{
                    "--ember-size": `${em.size}px`,
                    "--ember-dx": `${em.dx}px`,
                    "--ember-dy": `${em.dy}px`,
                    "--ember-delay": `${0.14 + em.delay}s`,
                    "--ember-dur": `${em.duration}s`,
                  }}
                />
              ))}
            </div>
          )}

          {pendingAfterAnim && (
            <div className="transmutation-pending" aria-label="Submitting reflection">
              <span className="transmutation-pending-dot" />
              <span className="transmutation-pending-dot" />
              <span className="transmutation-pending-dot" />
            </div>
          )}

          <div className="reflection-fields">
            <label className="reflection-label">
              LOCATION <span>optional</span>
              <input
                className="reflection-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                disabled={transmuting}
              />
            </label>

            <label className="reflection-label">
              THEME <span>optional</span>
              <input
                className="reflection-input"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="grief, uncertainty, belonging..."
                disabled={transmuting}
              />
            </label>

            <label className="reflection-label">
              PERSPECTIVE <span>optional</span>
              <input
                className="reflection-input"
                value={perspective}
                onChange={(e) => setPerspective(e.target.value)}
                placeholder="worker, parent, student, neighbor..."
                disabled={transmuting}
              />
            </label>
          </div>

          <div className="reflection-categories">
            {["ethical", "cultural", "historical", "interpersonal"].map(
              (cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`reflection-chip ${
                    categories.includes(cat) ? "active" : ""
                  }`}
                  disabled={transmuting}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim() || compositionLocked}
            className="reflection-submit"
          >
            {isSubmitting ? "Offering..." : "Contribute"}
          </button>

          <p className="reflection-footnote">
            Reflections are transformed before being added to the Collective.
          </p>

          {submitMessage && (
            <p className="reflection-submit-message">{submitMessage}</p>
          )}
        </form>
      </section>
    </main>
  );
}
