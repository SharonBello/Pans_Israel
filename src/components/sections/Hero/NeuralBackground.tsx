import { useEffect, useRef } from 'react';

interface FlowingLine {
  id: number;
  points: { x: number; y: number }[];
  targetPoints: { x: number; y: number }[];
  color: string;
  width: number;
  speed: number;
  phase: number;
}

const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const linesRef = useRef<FlowingLine[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const smoothMouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Vibrant color palette
    const colors = [
      '#0055B8',  // Vivid royal blue
      '#0088DD',  // Bright cyan blue
      '#00AAFF',  // Electric blue
      '#00D4FF',  // Cyan
      '#E67E22',  // Warm orange accent
      '#F39C12',  // Golden orange
    ];

    let width = 0;
    let height = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initLines();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const getRandomPoint = () => ({
      x: -300 + Math.random() * (width + 600),
      y: -300 + Math.random() * (height + 600),
    });

    const initLines = () => {
      linesRef.current = [];
      const numLines = 10;

      for (let i = 0; i < numLines; i++) {
        const numPoints = 10;
        const points: { x: number; y: number }[] = [];
        const targetPoints: { x: number; y: number }[] = [];

        for (let j = 0; j < numPoints; j++) {
          const point = getRandomPoint();
          points.push({ ...point });
          targetPoints.push(getRandomPoint());
        }

        linesRef.current.push({
          id: i,
          points,
          targetPoints,
          color: colors[i % colors.length],
          width: 6 + Math.random() * 6,
          speed: 0.0004 + Math.random() * 0.0006,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Draw gradient background (will be revealed by mask)
    const drawGradientBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#023373');
      gradient.addColorStop(0.25, '#0088DD');
      gradient.addColorStop(0.5, '#00AAFF');
      gradient.addColorStop(0.75, '#6CA6D9');
      gradient.addColorStop(1, '#E67E22');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    // Draw mask with line cutouts
    const drawMaskWithLines = (time: number) => {
      // Create off-screen canvas for mask
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      // Fill mask with cover color
      maskCtx.fillStyle = '#F2F2F2';
      maskCtx.fillRect(0, 0, width, height);

      // Cut out lines using destination-out
      maskCtx.globalCompositeOperation = 'destination-out';

      linesRef.current.forEach(line => {
        const { points, width: lineWidth, phase } = line;
        
        if (points.length < 2) return;

        // Animate points
        const wobbledPoints = points.map((p, i) => ({
          x: p.x + Math.sin(time * 0.3 + phase + i * 1.5) * 8,
          y: p.y + Math.cos(time * 0.25 + phase + i * 1.2) * 8,
        }));

        // Smooth mouse repulsion
        const finalPoints = wobbledPoints.map(p => {
          const dx = p.x - smoothMouseRef.current.x;
          const dy = p.y - smoothMouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;

          if (dist < maxDist && dist > 0) {
            const force = Math.pow((maxDist - dist) / maxDist, 2);
            return {
              x: p.x + (dx / dist) * force * 100,
              y: p.y + (dy / dist) * force * 100,
            };
          }
          return p;
        });

        // Draw thick line to cut out
        maskCtx.beginPath();
        maskCtx.lineCap = 'round';
        maskCtx.lineJoin = 'round';
        maskCtx.lineWidth = lineWidth + 20; // Thicker for glow effect
        maskCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // Partial transparency for soft edge

        maskCtx.moveTo(finalPoints[0].x, finalPoints[0].y);
        for (let i = 0; i < finalPoints.length - 1; i++) {
          const curr = finalPoints[i];
          const next = finalPoints[i + 1];
          const cpX = (curr.x + next.x) / 2;
          const cpY = (curr.y + next.y) / 2;
          maskCtx.quadraticCurveTo(curr.x, curr.y, cpX, cpY);
        }
        maskCtx.lineTo(finalPoints[finalPoints.length - 1].x, finalPoints[finalPoints.length - 1].y);
        maskCtx.stroke();

        // Draw core line (fully cut out)
        maskCtx.beginPath();
        maskCtx.lineWidth = lineWidth;
        maskCtx.strokeStyle = 'rgba(0, 0, 0, 1)';

        maskCtx.moveTo(finalPoints[0].x, finalPoints[0].y);
        for (let i = 0; i < finalPoints.length - 1; i++) {
          const curr = finalPoints[i];
          const next = finalPoints[i + 1];
          const cpX = (curr.x + next.x) / 2;
          const cpY = (curr.y + next.y) / 2;
          maskCtx.quadraticCurveTo(curr.x, curr.y, cpX, cpY);
        }
        maskCtx.lineTo(finalPoints[finalPoints.length - 1].x, finalPoints[finalPoints.length - 1].y);
        maskCtx.stroke();
      });

      // Draw mask on main canvas
      ctx.drawImage(maskCanvas, 0, 0);
    };

    const updateLines = () => {
      linesRef.current.forEach(line => {
        line.points.forEach((point, i) => {
          const target = line.targetPoints[i];
          
          const dx = target.x - point.x;
          const dy = target.y - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          point.x += dx * line.speed;
          point.y += dy * line.speed;

          if (dist < 50) {
            line.targetPoints[i] = getRandomPoint();
          }
        });
      });
    };

    let time = 0;

    const animate = () => {
      time += 0.016;

      // Smooth mouse position
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.05;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.05;

      // Draw colorful gradient background
      drawGradientBackground();

      // Update line positions
      updateLines();

      // Draw mask with line cutouts (reveals gradient)
      drawMaskWithLines(time);

      animationRef.current = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default NeuralBackground;