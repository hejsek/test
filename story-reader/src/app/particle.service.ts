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

    // Chaotic firefly layer
    if (fireflyId) {
      particlesJS(fireflyId, {
        particles: {
          number: { value: 20, density: { enable: true, value_area: 800 } },
          color: { value: '#ccff55' },
          shape: { type: 'circle' },
          opacity: {
            value: 1,
            anim: { enable: true, speed: 1, opacity_min: 0.2, sync: false },
          },
          size: {
            value: 4,
            random: true,
            anim: { enable: true, speed: 4, size_min: 1, sync: false },
          },
          line_linked: { enable: false },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
          },
        },
        retina_detect: true,
      });
    }
  }
}
