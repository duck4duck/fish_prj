import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
  wobbleDistance: number;
  wobbleAngle: number;
  opacity: number;
  hueShift: number; // slight variation around rose/pink
}

export const AquariumBubbles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse interaction tracking
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initialize 48 bioluminescent bubbles
    const bubbleCount = 48;
    const bubbles: Bubble[] = [];

    const createBubble = (initialY?: number): Bubble => {
      const radius = 5 + Math.random() * 26; // 5px to 31px
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + Math.random() * 100,
        radius,
        // Larger bubbles rise faster, small ones drift lazily
        speed: 0.5 + (radius / 30) * 1.4 + Math.random() * 0.4,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleDistance: 0.8 + Math.random() * 1.6,
        wobbleAngle: Math.random() * Math.PI * 2,
        opacity: 0.25 + (radius / 31) * 0.45,
        hueShift: Math.random() * 20 - 10, // subtle color variety
      };
    };

    // Stagger bubbles across the viewport height initially
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(createBubble(Math.random() * height));
    }

    // Click produces a cluster of tiny bubbles!
    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      for (let i = 0; i < 7; i++) {
        bubbles.push({
          x: clickX + (Math.random() - 0.5) * 30,
          y: clickY + (Math.random() - 0.5) * 30,
          radius: 3 + Math.random() * 8,
          speed: 1.5 + Math.random() * 2,
          wobbleSpeed: 0.04 + Math.random() * 0.04,
          wobbleDistance: 1.2,
          wobbleAngle: Math.random() * Math.PI * 2,
          opacity: 0.8,
          hueShift: 5,
        });
      }
    };
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];

        // Animate position
        b.wobbleAngle += b.wobbleSpeed;
        b.x += Math.sin(b.wobbleAngle) * b.wobbleDistance;
        b.y -= b.speed;

        // Mouse avoidance: gently push bubbles away from mouse
        const dx = b.x - mouseX;
        const dy = b.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          b.x += (dx / dist) * force * 3;
          b.y -= force * 1.5;
        }

        // Draw bubble
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);

        // Radial gradient for 3D liquid sphere look
        // Center is transparent, rim is glowing rose/magenta
        const grad = ctx.createRadialGradient(
          b.x - b.radius * 0.3,
          b.y - b.radius * 0.3,
          b.radius * 0.1,
          b.x,
          b.y,
          b.radius
        );

        const rColor = Math.min(255, Math.max(200, 229 + b.hueShift));
        const gColor = Math.min(100, Math.max(30, 57 + b.hueShift * 2));
        const bColor = Math.min(160, Math.max(90, 116 + b.hueShift));

        grad.addColorStop(0, `rgba(255, 255, 255, ${b.opacity * 0.8})`);
        grad.addColorStop(0.3, `rgba(${rColor}, ${gColor}, ${bColor}, ${b.opacity * 0.3})`);
        grad.addColorStop(0.85, `rgba(${rColor}, ${gColor}, ${bColor}, ${b.opacity * 0.7})`);
        grad.addColorStop(1, `rgba(255, 120, 180, ${b.opacity * 0.95})`);

        ctx.fillStyle = grad;
        ctx.shadowColor = `rgba(229, 57, 116, ${b.opacity * 0.6})`;
        ctx.shadowBlur = b.radius * 0.8;
        ctx.fill();

        // Shiny specular glint (top left white reflection)
        ctx.beginPath();
        ctx.ellipse(
          b.x - b.radius * 0.35,
          b.y - b.radius * 0.38,
          b.radius * 0.32,
          b.radius * 0.18,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, b.opacity * 1.1)})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#FFFFFF';
        ctx.fill();

        // Tiny secondary bottom-right specular rim reflection
        ctx.beginPath();
        ctx.arc(
          b.x + b.radius * 0.3,
          b.y + b.radius * 0.3,
          b.radius * 0.14,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 180, 210, ${b.opacity * 0.5})`;
        ctx.fill();

        ctx.restore();

        // Recycle bubble when it floats off top of screen
        if (b.y + b.radius < -20) {
          if (bubbles.length > bubbleCount) {
            // Remove click bursts once off screen
            bubbles.splice(i, 1);
          } else {
            // Respawn normal bubble at bottom
            b.y = height + b.radius + Math.random() * 40;
            b.x = Math.random() * width;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <View style={styles.bubbleLayer} pointerEvents="none">
      <canvas
        ref={canvasRef}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleLayer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Above page root background, below interactive buttons/content
    pointerEvents: 'none',
  },
});
