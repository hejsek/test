import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TtsService } from './tts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  prompt = '';
  audioUrl?: string;
  loading = false;
  @ViewChild('player') audioRef?: ElementRef<HTMLAudioElement>;

  constructor(private tts: TtsService) {}

  async generate() {
    if (!this.prompt) return;
    this.loading = true;
    this.audioUrl = undefined;
    try {
      const blob = await this.tts.synthesize(this.prompt).toPromise();
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
