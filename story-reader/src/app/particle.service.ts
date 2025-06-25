import { Injectable } from '@angular/core';

declare const particlesJS: any;

@Injectable({ providedIn: 'root' })
export class ParticleService {
  init(id: string) {
    if (typeof particlesJS === 'undefined') {
      return;
    }
    particlesJS(id, {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: '#c0a6ff' },
        shape: { type: 'circle' },
        opacity: { value: 0.7 },
        size: { value: 3, random: true },
        line_linked: {
          enable: false,
          distance: 150,
          color: '#c0a6ff',
          opacity: 0.4,
          width: 1,
        },
        move: { enable: true, speed: 0.6 },
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
  }
}
