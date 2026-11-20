import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  color: string;
}

interface DriftingLeaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  alpha: number;
  kind: 'leaf' | 'petal';
  color: string;
  veinColor: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
  hue: string;
}

export function ShootingStarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Card-matched botanical dust: sage, antique gold, forest green, soft mist olive
    const starColors = ['#7A8E74', '#BF9042', '#546B57', '#A5B59F'];
    const starCount = width < 640 ? 22 : 34;
    const stars: Star[] = Array.from({ length: starCount }, (_, i) => ({
      x: ((i * 197 + 43) % 100) / 100,
      y: ((i * 313 + 17) % 100) / 100,
      radius: 1 + (i % 3) * 0.55,
      phase: i * 0.7,
      speed: 0.016 + (i % 4) * 0.006,
      color: starColors[i % starColors.length],
    }));

    // Consistent drifting botanical sage leaves & warm ivory gardenia petals
    const leafColors = ['#7A8E74', '#546B57', '#8EA187'];
    const petalColors = ['#F2EAE0', '#EAE0D0'];
    const itemCount = width < 640 ? 12 : 18;
    const items: DriftingLeaf[] = Array.from({ length: itemCount }, (_, i) => {
      const isLeaf = i % 3 !== 2;
      return {
        x: ((i * 131 + 23) % 100) * 0.01 * width,
        y: ((i * 211 + 61) % 100) * 0.01 * height,
        vx: -0.2 - (i % 3) * 0.13,
        vy: 0.34 + (i % 4) * 0.15,
        size: isLeaf ? 6 + (i % 3) * 2.2 : 4.5 + (i % 3) * 1.6,
        angle: i * 0.85,
        spin: 0.011 * (i % 2 === 0 ? 1 : -1),
        alpha: isLeaf ? 0.24 + (i % 3) * 0.07 : 0.38 + (i % 2) * 0.12,
        kind: isLeaf ? 'leaf' : 'petal',
        color: isLeaf
          ? leafColors[i % leafColors.length]
          : petalColors[i % petalColors.length],
        veinColor: isLeaf ? '#434634' : '#C9BA9F',
      };
    });

    const shootingStars: ShootingStar[] = [];
    let nextSpawnAt = 850;
    let lastTime = performance.now();
    let rafId = 0;

    const spawnShootingStar = () => {
      const startFromTop = Math.random() > 0.35;
      const startX = startFromTop
        ? Math.random() * width * 0.85
        : width * (0.65 + Math.random() * 0.35);
      const startY = startFromTop
        ? Math.random() * height * 0.25
        : Math.random() * height * 0.45;
      const speed = 4.5 + Math.random() * 2.6;
      const angle = (Math.PI * 3) / 4 + (Math.random() - 0.5) * 0.22;

      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 80 + Math.random() * 65,
        life: 0,
        maxLife: 54 + Math.random() * 26,
        hue: Math.random() > 0.45 ? '191, 144, 66' : '122, 142, 116',
      });
    };

    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        ctx.save();
        ctx.globalAlpha = 0.24;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    spawnShootingStar();

    const tick = (now: number) => {
      const dt = Math.min(34, now - lastTime);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Twinkling botanical dust
      for (const s of stars) {
        s.phase += s.speed * (dt / 16);
        const alpha = 0.16 + ((Math.sin(s.phase) + 1) / 2) * 0.34;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Gently drifting sage leaves & ivory petals matching the card artwork
      for (const p of items) {
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.angle += p.spin * (dt / 16);

        if (p.y > height + 24) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -24) {
          p.x = width + 20;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.kind === 'leaf') {
          // Pointed botanical leaf silhouette with delicate central rib
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.quadraticCurveTo(0, -p.size * 0.56, p.size, 0);
          ctx.quadraticCurveTo(0, p.size * 0.56, -p.size, 0);
          ctx.fill();

          ctx.strokeStyle = p.veinColor;
          ctx.globalAlpha = p.alpha * 0.55;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(-p.size * 0.78, 0);
          ctx.lineTo(p.size * 0.78, 0);
          ctx.stroke();
        } else {
          // Soft ivory gardenia petal
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.62, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Gold & sage shooting stars
      nextSpawnAt -= dt;
      if (nextSpawnAt <= 0 && shootingStars.length < 3) {
        spawnShootingStar();
        nextSpawnAt = 1600 + Math.random() * 1900;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const st = shootingStars[i];
        st.life += dt / 16;
        st.x += st.vx * (dt / 16);
        st.y += st.vy * (dt / 16);

        const progress = st.life / st.maxLife;
        const fade =
          progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);
        const norm = Math.hypot(st.vx, st.vy) || 1;
        const tailX = st.x - (st.vx / norm) * st.length;
        const tailY = st.y - (st.vy / norm) * st.length;

        const grad = ctx.createLinearGradient(tailX, tailY, st.x, st.y);
        grad.addColorStop(0, `rgba(${st.hue}, 0)`);
        grad.addColorStop(0.65, `rgba(${st.hue}, ${(0.34 * fade).toFixed(3)})`);
        grad.addColorStop(1, `rgba(255, 252, 245, ${(0.92 * fade).toFixed(3)})`);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(st.x, st.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(${st.hue}, ${(0.8 * fade).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, 1.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (st.life >= st.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
