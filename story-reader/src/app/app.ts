import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TtsService } from './tts.service';
import { ParticleService } from './particle.service';
import { StoryService } from './story.service';

declare var Plyr: any;

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
  story = '';
  displayedStory = '';
  words: string[] = [];
  currentWordIndex = -1;
  @ViewChild('player') audioRef?: ElementRef<HTMLAudioElement>;
  private player?: any;
  private animationInterval?: any;

  constructor(
    private tts: TtsService,
    private storyService: StoryService,
    private particles: ParticleService
  ) {}

  ngAfterViewInit(): void {
    this.particles.init('particles-js', 'fireflies-js');
    if (this.audioRef?.nativeElement && typeof Plyr !== 'undefined') {
      this.player = new Plyr(this.audioRef.nativeElement, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume']
      });
    }
  }

  async generate() {
    if (!this.prompt) return;
    this.loading = true;
    this.audioUrl = undefined;
    this.story = '';
    this.displayedStory = '';
    this.words = [];
    this.currentWordIndex = -1;
    try {
      const res = await firstValueFrom(
        this.storyService.generateStory(this.prompt)
      );
      this.story = res.story;
      this.animateStory();
    } catch (err) {
      console.error('Failed to generate story', err);
    } finally {
      this.loading = false;
    }
  }

  animateStory() {
    const chars = this.story.split('');
    let index = 0;
    clearInterval(this.animationInterval);
    this.displayedStory = '';
    this.animationInterval = setInterval(() => {
      this.displayedStory += chars[index];
      index++;
      if (index >= chars.length) {
        clearInterval(this.animationInterval);
        this.words = this.story.split(/\s+/);
      }
    }, 30);
  }

  async playStory() {
    if (!this.story) return;
    this.loading = true;
    this.audioUrl = undefined;
    this.words = [];
    this.currentWordIndex = -1;
    try {
      const blob = await firstValueFrom(this.tts.synthesize(this.story));
      this.audioUrl = URL.createObjectURL(blob);
      setTimeout(() => {
        if (this.audioRef?.nativeElement) {
          this.audioRef.nativeElement.load();
          if (this.player) {
            this.player.source = {
              type: 'audio',
              sources: [{ src: this.audioUrl!, type: 'audio/mp3' }]
            };
            this.player.play();
          } else {
            this.audioRef.nativeElement.play();
          }
        }
      });
    } catch (err) {
      console.error('Failed to fetch audio', err);
    } finally {
      this.loading = false;
    }
  }

  onTimeUpdate() {
    const elem = this.audioRef?.nativeElement;
    const player = this.player ?? elem;
    if (!player || !this.words.length) return;
    if (!player.duration) return;
    const index = Math.floor((player.currentTime / player.duration) * this.words.length);
    this.currentWordIndex = index;
  }

  onEnded() {
    this.currentWordIndex = -1;
  }
}
