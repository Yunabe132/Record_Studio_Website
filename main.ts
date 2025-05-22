// Particle interface
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string;
}

// Mouse position interface
interface MousePosition {
  x: number; y: number;
}

// Animated Background Canvas System
class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse: MousePosition = { x: 0, y: 0 };

  constructor() {
    this.canvas = document.getElementById('floating-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    this.createParticles();
    this.setupEvents();
    this.animate();
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private createParticles(): void {
    const count = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
      });
    }
  }

  private setupEvents(): void {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  private animate(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p, i) => {
      // repulse
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 150) {
        const force = (150 - dist) / 150 * 0.01;
        p.vx -= (dx / dist) * force;
        p.vy -= (dy / dist) * force;
      }
      // move & wrap
      p.x = (p.x + p.vx + this.canvas.width) % this.canvas.width;
      p.y = (p.y + p.vy + this.canvas.height) % this.canvas.height;
      // draw
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fill();
      // connect
      this.particles.slice(i+1).forEach(q => {
        const dx2 = p.x - q.x, dy2 = p.y - q.y;
        const d2 = Math.hypot(dx2, dy2);
        if (d2 < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(q.x, q.y);
          this.ctx.strokeStyle = p.color;
          this.ctx.globalAlpha = ((100 - d2)/100)*0.2;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      });
    });
    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

// Site navigation & loading
class SiteManager {
  private sections = document.querySelectorAll('.section');
  private navLinks = document.querySelectorAll('[data-section]');
  private hero = document.getElementById('hero')!;

  constructor() {
    this.navLinks.forEach(link =>
      link.addEventListener('click', e => {
        e.preventDefault();
        const section = (link as HTMLElement).dataset.section!;
        this.showSection(section);
      })
    );
    setTimeout(() => {
      const ld = document.getElementById('loading')!;
      ld.style.opacity = '0';
      setTimeout(() => ld.style.display = 'none', 500);
    }, 1500);
  }

  private showSection(name: string) {
    if (name === 'home') {
      this.hero.style.display = 'flex';
      this.sections.forEach(s => s.classList.remove('active'));
    } else {
      this.hero.style.display = 'none';
      this.sections.forEach(s => s.classList.remove('active'));
      document.getElementById(`${name}-section`)?.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// Scroll-hide nav
class ScrollEffects {
  private nav = document.querySelector('nav')!;
  private lastY = 0;
  constructor() {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      this.nav.style.background = y > 100
        ? 'rgba(10,10,10,0.98)'
        : 'rgba(10,10,10,0.95)';
      this.nav.style.transform = (y > this.lastY && y > 100)
        ? 'translateY(-100%)'
        : 'translateY(0)';
      this.lastY = y;
    });
  }
}

// Card hover effects
class CardEffects {
  constructor() {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', () =>
        (card as HTMLElement).style.transform = 'translateY(-10px) rotateX(5deg)'
      );
      card.addEventListener('mouseleave', () =>
        (card as HTMLElement).style.transform = 'translateY(0) rotateX(0deg)'
      );
    });
  }
}

// Init everything
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
  new SiteManager();
  new ScrollEffects();
  new CardEffects();
  // fade in
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 100);
  });
});

export { ParticleSystem, SiteManager, ScrollEffects, CardEffects };
