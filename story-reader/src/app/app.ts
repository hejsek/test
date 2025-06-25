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
