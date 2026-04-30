/**
 * main.js - Hardcore Server Tech SPA
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SPA Navigation Logic ---
  const navBtns = document.querySelectorAll('.nav-btn, .trigger-nav');
  const sections = document.querySelectorAll('.screen-section');

  function switchSection(targetId) {
    // Hide all
    sections.forEach(sec => sec.classList.remove('active'));
    // Deactivate nav btns
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show target
    const targetSec = document.getElementById(targetId);
    if (targetSec) {
      targetSec.classList.add('active');
    }
    
    // Activate nav
    const targetNav = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
    if (targetNav) {
      targetNav.classList.add('active');
    }
    
    // Re-trigger typing effect in target if exists
    triggerTypingEffects(targetSec);
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      switchSection(target);
    });
  });

  // --- 2. Typing Effect for Server Theme ---
  function triggerTypingEffects(container) {
    if (!container) return;
    const typeElements = container.querySelectorAll('.type-effect');
    typeElements.forEach(el => {
      // Very basic reset and re-animation
      el.style.animation = 'none';
      el.offsetHeight; // trigger reflow
      el.style.animation = null;
    });
  }
  // Initial typing
  triggerTypingEffects(document.getElementById('home'));

  // --- 3. Server Nodes Canvas Background ---
  const canvas = document.getElementById('digital-tact-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 65, 0.8)';
        ctx.fill();
        // Server node glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 0; // reset
      }
    }

    for (let i = 0; i < 80; i++) {
      nodes.push(new Node());
    }

    // Mouse interaction for the network
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function animateNetwork() {
      ctx.clearRect(0, 0, width, height);
      
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 65, ${1 - dist / 150})`;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        
        // Mouse connection
        if (mouse.x != null && mouse.y != null) {
          const dx = nodes[i].x - mouse.x;
          const dy = nodes[i].y - mouse.y;
          const distMouse = Math.sqrt(dx * dx + dy * dy);
          if (distMouse < 200) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 255, ${1 - distMouse / 200})`; // cyan for mouse track
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            // pull slightly towards mouse
            nodes[i].x -= dx * 0.005;
            nodes[i].y -= dy * 0.005;
          }
        }
      }

      requestAnimationFrame(animateNetwork);
    }
    
    animateNetwork();
  }
});
