import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TtsService } from './tts.service';
import { ParticleService } from './particle.service';
import { StoryService } from './story.service';
import { AudioPlayer } from './audio-player';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, AudioPlayer],
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
  @ViewChild('player') playerComp?: AudioPlayer;
  private animationInterval?: any;

  constructor(
    private tts: TtsService,
    private storyService: StoryService,
    private particles: ParticleService
  ) {}

  ngAfterViewInit(): void {
    this.particles.init('particles-js', 'fireflies-js');
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
    clearInterval(this.animationInterval);
    this.displayedStory = this.story;
    this.words = this.story.split(/\s+/);
  }

  async playStory() {
    if (!this.story) return;
    this.loading = true;
    this.audioUrl = undefined;
    this.currentWordIndex = -1;
    try {
      const blob = await firstValueFrom(this.tts.synthesize(this.story));
      this.audioUrl = URL.createObjectURL(blob);
      setTimeout(() => {
        this.playerComp?.loadAndPlay(this.audioUrl!);
        this.currentWordIndex = 0;
      });
    } catch (err) {
      console.error('Failed to fetch audio', err);
    } finally {
      this.loading = false;
    }
  }

  onTimeUpdate(event: Event) {
    const elem = event.target as HTMLAudioElement | null;
    if (!elem || !this.words.length) return;
    if (!elem.duration) return;
    const index = Math.floor((elem.currentTime / elem.duration) * this.words.length);
    this.currentWordIndex = Math.min(index, this.words.length - 1);
  }

  onEnded() {
    this.currentWordIndex = -1;
  }
}
