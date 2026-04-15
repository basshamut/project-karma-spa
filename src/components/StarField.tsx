import { useEffect, useRef } from "react";

const STAR_COUNT = 200;
const CONSTELLATION_DISTANCE = 120;

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.3,
      speed: Math.random() * 0.25 + 0.04,
      phase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.06,
      driftY: (Math.random() - 0.5) * 0.04,
    }));

    // Shooting stars
    type Shooter = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
    const shooters: Shooter[] = [];
    const spawnShooter = () => {
      shooters.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.4,
        vx: 3 + Math.random() * 4,
        vy: 1.5 + Math.random() * 2,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      });
    };
    let shooterTimer = 0;

    let frame: number;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // Drift stars slightly
      for (const s of stars) {
        s.x = (s.x + s.driftX + width) % width;
        s.y = (s.y + s.driftY + height) % height;
      }

      // Draw constellation lines between nearby stars
      ctx.lineWidth = 0.4;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONSTELLATION_DISTANCE) {
            const alpha = (1 - dist / CONSTELLATION_DISTANCE) * 0.12;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(212, 175, 100, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw stars
      for (const s of stars) {
        const opacity = 0.25 + 0.75 * Math.sin(t * 0.001 * s.speed + s.phase);
        // Glow halo
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        grd.addColorStop(0, `rgba(230, 200, 140, ${opacity * 0.6})`);
        grd.addColorStop(1, `rgba(230, 200, 140, 0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 200, ${opacity})`;
        ctx.fill();
      }

      // Shooting stars
      shooterTimer++;
      if (shooterTimer > 180 + Math.random() * 200) {
        spawnShooter();
        shooterTimer = 0;
      }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        sh.life++;
        const progress = sh.life / sh.maxLife;
        const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
        const tailLen = 80 * (1 - progress * 0.5);
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * tailLen / sh.vx, sh.y - sh.vy * tailLen / sh.vx);
        grad.addColorStop(0, `rgba(255, 240, 200, ${alpha})`);
        grad.addColorStop(1, `rgba(255, 240, 200, 0)`);
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - (sh.vx / Math.hypot(sh.vx, sh.vy)) * tailLen, sh.y - (sh.vy / Math.hypot(sh.vx, sh.vy)) * tailLen);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        sh.x += sh.vx;
        sh.y += sh.vy;
        if (sh.life >= sh.maxLife) shooters.splice(i, 1);
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default StarField;
