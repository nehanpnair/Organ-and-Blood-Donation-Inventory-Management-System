import React, { useRef, useEffect } from "react";

function rand(min, max) { return Math.random() * (max - min) + min; }

export default function RBCCanvas({ width = "100%", height = 240, density = 35 }) {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = canvas.clientWidth;
    let h = canvas.height = canvas.clientHeight;
    let raf;
    let cells = [];

    function init() {
      cells = Array.from({length: density}).map(() => ({
        x: rand(0, w),
        y: rand(h * 0.2, h),
        vx: rand(-0.3, 0.3),
        vy: -rand(0.2, 1.0),
        r: rand(12, 36),
        rot: rand(0, Math.PI*2),
        rotSpeed: rand(-0.01, 0.01),
        alpha: rand(0.5, 0.95)
      }));
    }

    function draw() {
      ctx.clearRect(0,0,w,h);
      // subtle background
      ctx.fillStyle = 'rgba(15,23,42,0.03)';
      ctx.fillRect(0,0,w,h);

      for (let c of cells) {
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.rotSpeed;
        if (c.y + c.r < -50) {
          c.y = h + 40;
          c.x = rand(0,w);
        }
        // draw biconcave-ish cell
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        const grd = ctx.createRadialGradient(-c.r*0.15, -c.r*0.2, c.r*0.05, 0, 0, c.r);
        grd.addColorStop(0, 'rgba(255, 200, 200, ' + c.alpha + ')');
        grd.addColorStop(0.4, 'rgba(255, 80, 80, ' + (0.9*c.alpha) + ')');
        grd.addColorStop(1, 'rgba(120, 10, 10, ' + (0.85*c.alpha) + ')');
        ctx.fillStyle = grd;

        // draw oval body
        ctx.beginPath();
        ctx.ellipse(0, 0, c.r*1.1, c.r*0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // inner concave shadow
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.beginPath();
        ctx.ellipse(-c.r*0.16, 0, c.r*0.55, c.r*0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';
        // soft highlight
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        ctx.ellipse(-c.r*0.4, -c.r*0.25, c.r*0.45, c.r*0.25, -0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    }

    function onResize() {
      w = canvas.width = canvas.clientWidth;
      h = canvas.height = canvas.clientHeight;
      init();
    }

    window.addEventListener('resize', onResize);
    init();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [density]);

  return (
  <canvas
    ref={ref}
    style={{
      position: "absolute", top: 0,
      left: 0, width: width,
      height: height, display: "block",
      borderRadius: 0, filter: "blur(1px)",      
      zIndex: 0, opacity: 0.8, pointerEvents: "none",          
    }}
  />
);
}
