import { Injectable } from '@angular/core';

declare const particlesJS: any;

@Injectable({ providedIn: 'root' })
export class ParticleService {
  init(starId: string, fireflyId?: string) {
    if (typeof particlesJS === 'undefined') {
      return;
    }

    // Base star layer
    particlesJS(starId, {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#c0a6ff' },
        shape: { type: 'circle' },
        opacity: { value: 0.7 },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.4 },
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: 'repulse' },
          onclick: { enable: true, mode: 'push' },
        },
        modes: {
          repulse: { distance: 100 },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });

    // Firefly layer - blinking fireflies with dynamic movement
    if (fireflyId) {
      particlesJS(fireflyId, {
        particles: {
          number: { value: 2, density: { enable: true, value_area: 800 } },
          color: { value: '#ffd166' },
          shape: { type: 'circle' },
          opacity: {
            value: 1,
            anim: { enable: true, speed: 0.5, opacity_min: 0, sync: false },
          },
          size: {
            value: 4,
            random: true,
            anim: { enable: true, speed: 1, size_min: 1, sync: false },
          },
          line_linked: { enable: false },
          move: {
            enable: true,
            speed: 3,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
          },
        },
        retina_detect: true,
      });

      // Periodically change speed to mimic erratic firefly movement
      setInterval(() => {
        const instance = (window as any).pJSDom?.find((p: any) => p?.pJS?.canvas?.el?.id === fireflyId)?.pJS;
        if (instance) {
          instance.particles.move.speed = 1 + Math.random() * 4; // between 1 and 5
        }
      }, 2000);
    }
  }
}
