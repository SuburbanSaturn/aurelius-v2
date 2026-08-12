import { useEffect, useRef } from "react";

/**
 * CelestialField — lightweight canvas-based ambient particle system.
 *
 * Props:
 *   density — "sparse" | "normal" | "rich" (default: "normal")
 *   speed — movement speed multiplier (default: 1)
 *
 * Renders multi-color celestial objects: stars, red vortices,
 * constellation lines, nebula glows, and traveling traces.
 */
export default function CelestialField({ density = "normal", speed = 1 }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height, dpr;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const palette = [
      { r: 220, g: 50, b: 40 },
      { r: 255, g: 80, b: 50 },
      { r: 210, g: 160, b: 60 },
      { r: 140, g: 90, b: 160 },
      { r: 180, g: 200, b: 230 },
      { r: 255, g: 245, b: 240 },
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

    const starCount = density === "sparse" ? 18 : density === "rich" ? 36 : 26;
    const speedMul = speed;

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

    // Stars
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const layer = i < Math.floor(starCount * 0.3) ? 0 : i < Math.floor(starCount * 0.7) ? 1 : 2;
      let x = Math.random(), y = Math.random();
      if (Math.random() < 0.45) {
        x = Math.random() < 0.5 ? Math.random() * 0.18 : 0.82 + Math.random() * 0.18;
      }
      const color = pickColor(layer);
      const size = layer === 0 ? 0.6 + Math.random() * 0.4 : layer === 1 ? 1 + Math.random() * 0.7 : 1.4 + Math.random() * 1;
      const isRed = color.r > 180 && color.g < 100 && color.b < 80;

      stars.push({
        x, y, baseX: x, baseY: y, size, color, layer, isVortex: isRed && layer > 0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (isRed && layer > 0) ? (0.0005 + Math.random() * 0.0008) * (Math.random() < 0.5 ? 1 : -1) : 0,
        baseOpacity: layer === 0 ? 0.1 + Math.random() * 0.07 : layer === 1 ? 0.16 + Math.random() * 0.12 : 0.26 + Math.random() * 0.16,
        opacity: 0,
        phase: Math.random() * Math.PI * 2,
        speed: ((layer === 0 ? 0.0002 : layer === 1 ? 0.0004 : 0.0006) + Math.random() * 0.0002) * speedMul,
        driftRadius: 0.005 + Math.random() * 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.0004 + Math.random() * 0.0005,
        pulseActive: Math.random() < 0.12,
      });
    }

    // Constellation groups
    const constellations = [];
    const used = new Set();
    for (let seed = 0; seed < stars.length && constellations.length < 2; seed++) {
      if (used.has(seed) || stars[seed].layer === 0) continue;
      const group = [seed];
      for (let j = 0; j < stars.length && group.length < 4; j++) {
        if (j === seed || used.has(j) || stars[j].layer === 0) continue;
        const dx = stars[seed].baseX - stars[j].baseX;
        const dy = stars[seed].baseY - stars[j].baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.14 && dist > 0.02) group.push(j);
      }
      if (group.length >= 3) {
        constellations.push(group);
        group.forEach(idx => used.add(idx));
      }
    }

    // Nebula glows
    const glows = [
      { x: 0.2 + Math.random() * 0.6, y: 0.25 + Math.random() * 0.5, radius: 60 + Math.random() * 40, color: { r: 120, g: 18, b: 18 }, baseOpacity: 0.02, phase: Math.random() * Math.PI * 2, speed: 0.00008 },
      { x: 0.3 + Math.random() * 0.4, y: 0.3 + Math.random() * 0.4, radius: 50 + Math.random() * 30, color: { r: 70, g: 45, b: 90 }, baseOpacity: 0.018, phase: Math.random() * Math.PI * 2, speed: 0.0001 },
    ];

    let lastTime = performance.now();

    const render = (now) => {
      if (reducedMotion) {
        ctx.clearRect(0, 0, width, height);
        for (const s of stars) {
          ctx.beginPath();
          ctx.arc(s.baseX * width, s.baseY * height, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${s.baseOpacity * 0.4})`;
          ctx.fill();
        }
        return;
      }

      animFrameRef.current = requestAnimationFrame(render);
      const dt = now - lastTime;
      lastTime = now;
      if (dt > 100) return;

      ctx.clearRect(0, 0, width, height);

      // Glows
      for (const g of glows) {
        g.phase += g.speed * dt;
        const op = g.baseOpacity * (0.7 + 0.3 * Math.sin(g.phase));
        const gx = g.x * width;
        const gy = g.y * height;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.radius);
        grad.addColorStop(0, `rgba(${g.color.r}, ${g.color.g}, ${g.color.b}, ${op})`);
        grad.addColorStop(1, `rgba(${g.color.r}, ${g.color.g}, ${g.color.b}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(gx - g.radius, gy - g.radius, g.radius * 2, g.radius * 2);
      }

      // Stars
      for (const s of stars) {
        s.phase += s.speed * dt;
        s.x = s.baseX + Math.sin(s.phase) * s.driftRadius;
        s.y = s.baseY + Math.cos(s.phase * 0.7) * s.driftRadius;
        if (s.isVortex) s.rotation += s.rotSpeed * dt;

        let op = s.baseOpacity;
        if (s.pulseActive) {
          s.pulsePhase += s.pulseSpeed * dt;
          op += Math.max(0, Math.sin(s.pulsePhase)) * 0.12;
          if (s.pulsePhase > Math.PI * 6) { s.pulseActive = false; s.pulsePhase = 0; }
        }
        s.opacity = Math.min(op, 0.7);

        const px = s.x * width;
        const py = s.y * height;
        const { r, g, b } = s.color;

        if (s.isVortex) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(s.rotation);
          ctx.beginPath();
          ctx.arc(0, 0, s.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.8})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.4})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.arc(0, 0, s.size * 0.7, 0, Math.PI * 1.1);
          ctx.stroke();
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.2})`;
          ctx.beginPath();
          ctx.arc(0, 0, s.size * 1.1, Math.PI * 0.7, Math.PI * 1.8);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity})`;
          ctx.fill();
          if (s.layer === 2 && s.opacity > 0.24) {
            ctx.beginPath();
            ctx.arc(px, py, s.size + 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.08})`;
            ctx.fill();
          }
        }
      }

      // Constellation lines
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = `rgba(200, 100, 80, 0.03)`;
      for (const group of constellations) {
        for (let i = 0; i < group.length - 1; i++) {
          const a = stars[group[i]];
          const b = stars[group[i + 1]];
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
        }
      }

      // Rare pulse
      if (Math.random() < 0.0003 * dt) {
        const c = stars[Math.floor(Math.random() * stars.length)];
        if (!c.pulseActive) { c.pulseActive = true; c.pulsePhase = 0; }
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
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
