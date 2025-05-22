// Particle interface for type safety
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

// Mouse position interface
interface MousePosition {
  x: number;
  y: number;
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
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    this.particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
      });
    }
  }
  
  private setupEvents(): void {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles(); // Recreate particles on resize
    });
    
    window.addEventListener('mousemove', (e: MouseEvent) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  private animate(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.vx -= (dx / distance) * force * 0.01;
        particle.vy -= (dy / distance) * force * 0.01;
      }
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Boundary check with wrap-around
      if (particle.x < 0) {
        particle.x = this.canvas.width;
      } else if (particle.x > this.canvas.width) {
        particle.x = 0;
      }
      
      if (particle.y < 0) {
        particle.y = this.canvas.height;
      } else if (particle.y > this.canvas.height) {
        particle.y = 0;
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
      
      // Connect nearby particles
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = particle.color;
          this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      });
    });
    
    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

// Navigation and Section Management
class SiteManager {
  private currentSection: string = 'home';
  private sections: NodeListOf<Element>;
  private navLinks: NodeListOf<Element>;
  private hero: HTMLElement;
  
  constructor() {
    this.sections = document.querySelectorAll('.section');
    this.navLinks = document.querySelectorAll('[data-section]');
    this.hero = document.getElementById('hero')!;
    
    this.setupNavigation();
    this.hideLoading();
  }
  
  private setupNavigation(): void {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const section = (link as HTMLElement).dataset.section;
        if (section) {
          this.showSection(section);
        }
      });
    });
  }
  
  private showSection(sectionName: string): void {
    if (sectionName === 'home') {
      this.hero.style.display = 'flex';
      this.sections.forEach(section => {
        (section as HTMLElement).classList.remove('active');
      });
    } else {
      this.hero.style.display = 'none';
      this.sections.forEach(section => {
        (section as HTMLElement).classList.remove('active');
      });
      
      const targetSection = document.getElementById(`${sectionName}-section`);
      if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    
    this.currentSection = sectionName;
  }
  
  private hideLoading(): void {
    setTimeout(() => {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }
    }, 1500);
  }
}

// Scroll Effects Manager
class ScrollEffects {
  private nav: HTMLElement;
  private lastScrollY: number = 0;
  
  constructor() {
    this.nav = document.querySelector('nav')!;
    this.setupScrollEffects();
  }
  
  private setupScrollEffects(): void {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Change nav background based on scroll position
      if (currentScrollY > 100) {
        this.nav.style.background = 'rgba(10, 10, 10, 0.98)';
      } else {
        this.nav.style.background = 'rgba(10, 10, 10, 0.95)';
      }
      
      // Hide/show nav on scroll direction
      if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        this.nav.style.transform = 'translateY(-100%)';
      } else {
        this.nav.style.transform = 'translateY(0)';
      }
      
      this.lastScrollY = currentScrollY;
    });
  }
}

// Card Animation Effects
class CardEffects {
  constructor() {
    this.setupCardEffects();
  }
  
  private setupCardEffects(): void {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function(this: HTMLElement) {
        this.style.transform = 'translateY(-10px) rotateX(5deg)';
      });
      
      card.addEventListener('mouseleave', function(this: HTMLElement) {
        this.style.transform = 'translateY(0) rotateX(0deg)';
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all systems
  new ParticleSystem();
  new SiteManager();
  new ScrollEffects();
  new CardEffects();
  
  // Additional setup for smooth animations
  document.body.style.opacity = '0';
  
  // Fade in body after everything is loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 100);
  });
});

// Export classes for potential external use
export { ParticleSystem, SiteManager, ScrollEffects, CardEffects };