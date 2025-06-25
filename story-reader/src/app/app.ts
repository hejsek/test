import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TtsService } from './tts.service';
import { ParticleService } from './particle.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  prompt = '';
  audioUrl?: string;
  loading = false;
  @ViewChild('player') audioRef?: ElementRef<HTMLAudioElement>;

  constructor(private tts: TtsService, private particles: ParticleService) {}

  ngAfterViewInit(): void {
    this.particles.init('particles-js', 'fireflies-js');

    const star = document.getElementById('star');
    if (star) {
      let lastTime = performance.now();
      let lastX = 0;
      let lastY = 0;
      document.addEventListener('pointermove', (e) => {
        const now = performance.now();
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dt = now - lastTime || 1;
        lastTime = now;
        lastX = e.clientX;
        lastY = e.clientY;
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        const offset = Math.min(speed * 5, 30);
        (star as HTMLElement).style.transform = `translate(${offset}px, ${-offset}px)`;
        clearTimeout((star as any)._timer);
        (star as any)._timer = setTimeout(() => {
          (star as HTMLElement).style.transform = '';
        }, 100);
      });
    }
  }

  async generate() {
    if (!this.prompt) return;
    this.loading = true;
    this.audioUrl = undefined;
    try {
      const blob = await firstValueFrom(this.tts.synthesize(this.prompt));

      this.audioUrl = URL.createObjectURL(blob);
      setTimeout(() => {
        if (this.audioRef?.nativeElement) {
          this.audioRef.nativeElement.load();
          this.audioRef.nativeElement.play();
        }
      });
    } catch (err) {
      console.error('Failed to fetch audio', err);
    } finally {
      this.loading = false;
    }
  }
}
