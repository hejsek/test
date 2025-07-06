import { Component, ElementRef, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var Plyr: any;

@Component({
  selector: 'audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.css'
})
export class AudioPlayer implements AfterViewInit {
  @Input() src?: string;
  @Output() timeUpdate = new EventEmitter<Event>();
  @Output() ended = new EventEmitter<Event>();
  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;
  private player?: any;

  ngAfterViewInit() {
    if (this.audioRef?.nativeElement && typeof Plyr !== 'undefined') {
      this.player = new Plyr(this.audioRef.nativeElement, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume']
      });
      if (this.src) {
        this.setSource(this.src);
      }
    }
  }

  setSource(src: string) {
    this.src = src;
    if (this.player) {
      this.player.source = { type: 'audio', sources: [{ src, type: 'audio/mp3' }] };
    } else if (this.audioRef) {
      this.audioRef.nativeElement.src = src;
    }
  }

  play() {
    if (this.player) {
      this.player.play();
    } else if (this.audioRef) {
      this.audioRef.nativeElement.play();
    }
  }

  loadAndPlay(src: string) {
    this.setSource(src);
    if (this.audioRef) {
      this.audioRef.nativeElement.load();
    }
    this.play();
  }

  get currentTime(): number {
    if (this.player) return this.player.currentTime;
    return this.audioRef.nativeElement.currentTime;
  }

  get duration(): number {
    if (this.player) return this.player.duration;
    return this.audioRef.nativeElement.duration;
  }
}
