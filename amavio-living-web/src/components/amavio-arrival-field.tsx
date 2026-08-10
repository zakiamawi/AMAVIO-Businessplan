"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type Particle = {
  lane: number;
  phase: number;
  speed: number;
  depth: number;
};

const particles: Particle[] = Array.from({ length: 160 }, (_, index) => ({
  lane: index % 8,
  phase: index / 160,
  speed: 0.018 + (index % 5) * 0.004,
  depth: 0.46 + (index % 6) * 0.08,
}));

export function AmavioArrivalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    let frame = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      const originX = width * 0.37;
      const originY = height * 0.74;
      const targetX = width * 0.78;
      const targetY = height * 0.28;

      context.lineWidth = 1;

      particles.forEach((particle, index) => {
        const time = reducedMotion ? particle.phase : (particle.phase + frame * particle.speed * 0.001) % 1;
        const wave = Math.sin(time * Math.PI * 2 + particle.lane * 0.7);
        const x = originX + (targetX - originX) * time + wave * width * 0.045 * particle.depth;
        const y = originY + (targetY - originY) * time + Math.cos(time * 7 + particle.lane) * height * 0.035;
        const size = 1.1 + particle.depth * 1.8;
        const alpha = 0.18 + particle.depth * 0.18;

        context.beginPath();
        context.fillStyle = index % 4 === 0 ? `rgba(79, 210, 195, ${alpha})` : `rgba(214, 180, 106, ${alpha})`;
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();

        if (index % 9 === 0) {
          const nextTime = Math.min(1, time + 0.08);
          const nextX = originX + (targetX - originX) * nextTime + wave * width * 0.032;
          const nextY = originY + (targetY - originY) * nextTime + Math.cos(nextTime * 7 + particle.lane) * height * 0.03;
          context.beginPath();
          context.strokeStyle = `rgba(214, 180, 106, ${alpha * 0.38})`;
          context.moveTo(x, y);
          context.lineTo(nextX, nextY);
          context.stroke();
        }
      });

      context.globalCompositeOperation = "source-over";

      if (!reducedMotion) {
        frame += 16;
        raf = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="amavio-arrival-field" aria-hidden="true" />;
}
